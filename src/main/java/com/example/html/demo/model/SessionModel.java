package com.example.html.demo.model;

import lombok.Data;


import java.util.Date;


@Data
public class SessionModel {

    // 会话id
    private  String sessionId ;

    // 用户名
    private  String username;

    // ip地址
    private  String ip;


    // 登陆时间
    private Date  loginTime;

    // 最后访问时间；
    private  Date lastLoginTime;

    // 会话超时时间
    private int timeOutSecond;

     // 状态
    private int status;









}
