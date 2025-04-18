local coreInitFlow = import '../init/coreInitFlow.libsonnet';

coreInitFlow("in-app-module-init")
+ [
  {
    id: "in-app-module-init",
    label: "Initializing in-app module",
    log: "[CIO][InApp] Initializing in-app module with params {...}",
    success: "in-app-module-init-success",
    "error": "in-app-module-init-failure"
  },
  {
    id: "in-app-module-init-success",
    label: "Initializing in-app module success",
    log: "[CIO][InApp] Initializing in-app module success!",
    next: "in-app-module-init-polling"
  },
  {
    id: "in-app-module-init-failure",
    label: "Initializing in-app module failed",
    log: "[CIO][InApp] Initializing in-app module failed with error: {...}"
  },
  {
    id: "in-app-module-init-polling",
    label: "Polling in-app messages",
    log: "[CIO][InApp] Polling messages for user: {{userId}}...",
    success: "in-app-module-polling-success",
    "error": "in-app-module-polling-failure"
  },
  {
    id: "in-app-module-polling-success",
    label: "Polling in-app messages success",
    log: "[CIO][InApp] Polling messages for user: {{userId}} found {{messageCount}}",
    next: "in-app-module-message-loading"
  },
  {
    id: "in-app-module-polling-failure",
    label: "Polling in-app messages failed",
    log: "[CIO][InApp] Polling messages for user: {{userId}} failed with error: {...}"
  },
  {
    id: "in-app-module-message-loading",
    label: "Loading in-app message",
    log: "[CIO][InApp] Loading in-app message with id {{messageId}}",
    success: "in-app-module-message-displayed",
    "error": "in-app-module-message-loading-failed"
  },
  {
    id: "in-app-module-message-displayed",
    label: "Displaying in-app message",
    log: "[CIO][InApp] Displaying in-app message with id: {{messageId}}",
    next: "in-app-module-message-dismissed"
  },
  {
    id: "in-app-module-message-loading-failed",
    label: "Loading in-app message failed",
    log: "[CIO][InApp] Loading in-app message with id: {{messageId}} failed with error: {{error}}",
    next: "in-app-module-message-dismissed"
  },
  {
    id: "in-app-module-message-dismissed",
    label: "Dismissing in-app message",
    log: "[CIO][InApp] Dismissing in-app message with id: {{messageId}}"
  }
]