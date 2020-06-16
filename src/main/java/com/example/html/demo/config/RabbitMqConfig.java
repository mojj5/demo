package com.example.html.demo.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public final static String QUE_001 = "que_001";

    @Bean
    public Queue queue(){

        return  new Queue(QUE_001);
    }


}
