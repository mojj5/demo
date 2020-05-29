package com.example.html.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {


    @RequestMapping("/")
    public String index() {
        return "/index";
    }


    @RequestMapping("/main")
    public String main(ModelMap model) {

        model.addAttribute("test", "hello word !!!");
        return "/main";
    }

    @RequestMapping("/typography")
    public String typography() {
        return "/typography";
    }


}
