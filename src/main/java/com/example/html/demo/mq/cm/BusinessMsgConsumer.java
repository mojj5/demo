package com.example.html.demo.mq.cm;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;

import java.io.IOException;
import java.util.HashMap;

@Slf4j
@Component
public class BusinessMsgConsumer {


    @RabbitListener(queues = "que_001")
    public void receiveMsg(Message message, Channel channel) throws IOException {
        String msg = new String(message.getBody());


        log.info("收到业务消息：{}", msg);

        ObjectMapper objectMapper = new ObjectMapper();
        HashMap o = objectMapper.readValue(msg, HashMap.class);
        System.out.println("hashMap:实体"+o.get("name"));


        // 收到消息后返回确认
        channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, false);
    }
}