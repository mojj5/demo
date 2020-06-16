package com.example.html.demo.controller;

import com.example.html.demo.mq.pr.RabbitProducer;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Controller
public class IndexController {


    @Autowired
    StringRedisTemplate stringRedisTemplate;


    @Autowired
    RabbitProducer rabbitProducer;

    @RequestMapping("/")
    public String index(HttpSession session) {

        // 记录访问首页次数
        stringRedisTemplate.opsForValue().increment("index_count");

        // 用户登录后通知其它业务
        rabbitProducer.stringSend();



        return "/index";
    }





    @PreAuthorize("hasAuthority('p1')")
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
