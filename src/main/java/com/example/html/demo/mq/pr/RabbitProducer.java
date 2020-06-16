package com.example.html.demo.mq.pr;

import com.example.html.demo.config.RabbitMqConfig;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class RabbitProducer {

    @Autowired
    RabbitTemplate rabbitTemplate;

    public void stringSend() {
        Date date = new Date();
        String dateString = new SimpleDateFormat("yyy-MM-dd HH:mm:ss").format(date);
        System.out.println("[string] send msg:" + dateString);
        // 第一个参数为刚刚定义的队列名称
        Map map = new HashMap();
        map.put("date",dateString);
        map.put("name","index");
        ObjectMapper objectMapper = new ObjectMapper();
            String s ="";
        try {
            s = objectMapper.writeValueAsString(map);
            System.out.println("[string] send msg :"+s);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }


        this.rabbitTemplate.convertAndSend(RabbitMqConfig.QUE_001, s);
    }

}
