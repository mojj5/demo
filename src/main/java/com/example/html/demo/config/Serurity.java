package com.example.html.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;


import java.util.Collection;
import java.util.Iterator;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class Serurity extends WebSecurityConfigurerAdapter {
    public Serurity() {
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Autowired
    private LoginSuccessHandel loginSuccessHandel;
    @Autowired
    private LoginFailHandel LoginFailHandel;

    /**
     * 配置用户信息
     *
     * @param auth
     * @throws Exception
     */
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication().withUser("user").password("password").authorities("p1");
//        auth.userDetailsService(userDetailsService());
    }


    /**
     * 配置不需要进入security过滤器链
     *
     * @param web
     * @throws Exception
     */
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/select2/**", "/qa/**", "/Highcharts-4.2.3/**", "/Highcharts-4.2.3/**", "/font-awesome-4.6.3/**", "/ckeditor/**", "/assets/**", "/favicon.ico", "/error");
    }

    /**
     * 配置具体每个过滤器中需要定制的内容
     *
     * @param http
     * @throws Exception
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // frame 嵌套
        http.headers().frameOptions().disable()
                .and().csrf().disable();
        http.formLogin().loginPage("/loginPage").loginProcessingUrl("/loginUrl")
                .successHandler(loginSuccessHandel)
                .failureHandler(LoginFailHandel).permitAll();
        http.authorizeRequests().anyRequest().authenticated();
        //登出成功后重定向url
        http.logout().logoutSuccessUrl("/");
        //  鉴权失败处理页
        http.exceptionHandling().accessDeniedPage("/error-404");

        // 记住我
        http.rememberMe().rememberMeCookieName("remeber_me").tokenValiditySeconds(60*60*24*7);

        http.sessionManagement().maximumSessions(2).expiredUrl("/loginPage").sessionRegistry(sessionRegistry());
    }


}
