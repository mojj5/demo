package com.example.html.demo.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.ExceptionMappingAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Slf4j
@Component
public class LoginFailHandel extends SimpleUrlAuthenticationFailureHandler {

    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) throws IOException, ServletException {
        HttpSession session = request.getSession(false);
        String errormsg = null;
        if (e instanceof BadCredentialsException || e instanceof UsernameNotFoundException) {
            errormsg ="账户名或者密码输入错误!";
        } else if (e instanceof LockedException) {
           errormsg ="账户被锁定，请联系管理员!";
        } else if (e instanceof CredentialsExpiredException) {
           errormsg ="密码过期，请联系管理员!";
        } else if (e instanceof AccountExpiredException) {
           errormsg ="账户过期，请联系管理员!";
        } else if (e instanceof DisabledException) {
           errormsg ="账户被禁用，请联系管理员!";
        } else {
           errormsg ="登录失败!";
        }
        log.info("Authentication:{}",errormsg);
        if (session != null ) {
            request.getSession().setAttribute("error", errormsg);
        }
        response.sendRedirect("/loginPage");
    }
}
