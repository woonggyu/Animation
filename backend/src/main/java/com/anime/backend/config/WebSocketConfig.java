package com.anime.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 프런트엔드에서 SockJS를 통해 연결할 엔드포인트
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("http://localhost:5173") // React(Vite) 포트 허용
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 메시지를 받을 때(구독): /topic으로 시작하는 경로
        registry.enableSimpleBroker("/topic");
        // 메시지를 보낼 때(발행): /app으로 시작하는 경로
        registry.setApplicationDestinationPrefixes("/app");
    }
}