package com.DanielsProjects1.Chatter_Box_Starter.utils;

import java.util.UUID;

public final class CacheKeys {

    private CacheKeys() {}

    public static String widgetInit(UUID siteId, String pageUrl) {
        return "cache:widget:init:site:" + siteId + ":page:" + pageUrl;
    }
}
