package com.samir.travelplanner.dto;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class RestCountryResponse {

    private String cca2;
    private Name name;
    private List<String> capital;
    private String region;
    private Long population;
    private Map<String, Currency> currencies;
    private Flags flags;

    @Data
    public static class Name {
        private String common;
    }

    @Data
    public static class Currency {
        private String name;
    }

    @Data
    public static class Flags {
        private String png;
    }
}