package com.example.html.demo.config;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArraySet;


public class SessionManager implements SessionRegistry,
        ApplicationListener<SessionDestroyedEvent> {
    // ~ Instance fields
    // ================================================================================================

    protected final Log logger = LogFactory.getLog(SessionManager.class);

    /** <principal:Object,SessionIdSet> */
    private final ConcurrentMap<Object, Set<String>> principals;
    /** <sessionId:Object,SessionInformation> */
    private final Map<String, SessionInformation> sessionIds;

    // ~ Methods
    // ========================================================================================================

    public SessionManager() {
        this.principals = new ConcurrentHashMap<>();
        this.sessionIds = new ConcurrentHashMap<>();
    }

    public SessionManager(ConcurrentMap<Object, Set<String>> principals, Map<String, SessionInformation> sessionIds) {
        this.principals=principals;
        this.sessionIds=sessionIds;
    }


    @Override
    public List<Object> getAllPrincipals() {
        return new ArrayList<>(principals.keySet());
    }

    @Override
    public List<SessionInformation> getAllSessions(Object principal,
                                                   boolean includeExpiredSessions) {
        final Set<String> sessionsUsedByPrincipal = principals.get(principal);

        if (sessionsUsedByPrincipal == null) {
            return Collections.emptyList();
        }

        List<SessionInformation> list = new ArrayList<>(
                sessionsUsedByPrincipal.size());

        for (String sessionId : sessionsUsedByPrincipal) {
            SessionInformation sessionInformation = getSessionInformation(sessionId);

            if (sessionInformation == null) {
                continue;
            }

            if (includeExpiredSessions || !sessionInformation.isExpired()) {
                list.add(sessionInformation);
            }
        }

        return list;
    }

    @Override
    public SessionInformation getSessionInformation(String sessionId) {
        Assert.hasText(sessionId, "SessionId required as per interface contract");

        return sessionIds.get(sessionId);
    }

    @Override
    public void onApplicationEvent(SessionDestroyedEvent event) {
        String sessionId = event.getId();
        removeSessionInformation(sessionId);
    }

    @Override
    public void refreshLastRequest(String sessionId) {
        Assert.hasText(sessionId, "SessionId required as per interface contract");

        SessionInformation info = getSessionInformation(sessionId);

        if (info != null) {
            info.refreshLastRequest();
        }
    }

    @Override
    public void registerNewSession(String sessionId, Object principal) {
        Assert.hasText(sessionId, "SessionId required as per interface contract");
        Assert.notNull(principal, "Principal required as per interface contract");

        if (getSessionInformation(sessionId) != null) {
            removeSessionInformation(sessionId);
        }

        if (logger.isDebugEnabled()) {
            logger.debug("Registering session " + sessionId + ", for principal "
                    + principal);
        }

        sessionIds.put(sessionId,
                new SessionInformation(principal, sessionId, new Date()));

        Set<String> sessionsUsedByPrincipal = principals.get(principal);
        if (sessionsUsedByPrincipal ==null){
            sessionsUsedByPrincipal = new CopyOnWriteArraySet<>();
        }
        sessionsUsedByPrincipal.add(sessionId);

        principals.put(principal,sessionsUsedByPrincipal);




    }

    @Override
    public void removeSessionInformation(String sessionId) {
        Assert.hasText(sessionId, "SessionId required as per interface contract");

        SessionInformation info = getSessionInformation(sessionId);

        if (info == null) {
            return;
        }

        if (logger.isTraceEnabled()) {
            logger.debug("Removing session " + sessionId
                    + " from set of registered sessions");
        }

        sessionIds.remove(sessionId);

        Set<String> sessionsUsedByPrincipal = principals.get(info.getPrincipal());

        sessionsUsedByPrincipal.remove(sessionId);
        if (sessionsUsedByPrincipal.isEmpty()) {
            // No need to keep object in principals Map anymore
            if (logger.isDebugEnabled()) {
                logger.debug("Removing principal " + info.getPrincipal()
                        + " from registry");
            }
            sessionsUsedByPrincipal = null;
        }




    }
}
