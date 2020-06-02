package com.example.html.demo.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Slf4j
@Controller
public class IndexController {


    @RequestMapping("/")
    public String index() {
        return "/index";
    }


    @PreAuthorize("hasAuthority('p4')")
    @RequestMapping("/main")
    public String main(ModelMap model) {

        model.addAttribute("test", "hello word !!!");
        return "/main";
    }

    @RequestMapping("/error-404")
    public String typography() {
        return "/error-404";
    }

    @RequestMapping("/loginPage")
    public String login(HttpServletRequest request,ModelMap modelMap) {
        HttpSession session = request.getSession(false);
        Object error = request.getSession().getAttribute("error");
        log.info("error:{}",error);
        modelMap.addAttribute("error",error);
        return "/login";
    }


}
