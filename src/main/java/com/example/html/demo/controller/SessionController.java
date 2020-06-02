package com.example.html.demo.controller;

import com.example.html.demo.model.SessionModel;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.Context;
import org.apache.catalina.Manager;
import org.apache.catalina.Session;
import org.apache.catalina.connector.Request;
import org.apache.catalina.connector.RequestFacade;
import org.apache.catalina.session.ManagerBase;
import org.apache.catalina.session.StandardManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import sun.plugin.liveconnect.SecurityContextHelper;

import javax.servlet.http.HttpServletRequest;

import java.util.*;

@Slf4j
@Controller
public class SessionController {
    @Autowired
    private SessionRegistry sessionRegistry;

    /**
     * 获取当前在线用户
     * @param model
     * @param request
     * @return
     */
    @RequestMapping("/sys/session")
    public String seession_html(ModelMap model, HttpServletRequest request) {
        List<SessionModel> sessionList = new ArrayList<>();
        List<Object> principals = sessionRegistry.getAllPrincipals();
        if (principals != null) {
            for (Object principal : principals) {
                List<SessionInformation> allSessions = sessionRegistry.getAllSessions(principal, false);
                for (SessionInformation sessionInformation : allSessions) {
                    SessionModel sessionModel = new SessionModel();
                    String sessionId = sessionInformation.getSessionId();
                    UserDetails user = (UserDetails) sessionInformation.getPrincipal();
                    String username = user.getUsername();
                    sessionModel.setSessionId(sessionId);
                    sessionModel.setUsername(username);
                    sessionList.add(sessionModel);
                }
            }

        }
        model.addAttribute("num", 1);
        model.addAttribute("sessionList", sessionList);
        return "session";
    }

    /**
     * 强制退出
     * @param id
     * @return
     */
    @RequestMapping("/sys/session/{id}/forceLogout")
    public String forceLogout(@PathVariable("id") String id){
        log.info("强制退出：sessionId:"+id);
        SessionInformation sessionInformation = sessionRegistry.getSessionInformation(id);
        sessionInformation.expireNow();
        return "redirect:/sys/session";
    }


}
