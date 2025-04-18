local coreInitFlow = import '../init/coreInitFlow.libsonnet';

[
  {
    id: "start",
    label: "Start",
    next: "core-sdk-init"
  }
]
+ coreInitFlow("in-app-module-init")
+ [
  {
    id: "in-app-module-init",
    label: "Initializing in-app module",
    log: "[CIO][InApp] Initializing in-app module with params {...}",
    success: "in-app-module-init-success",
    "error": "in-app-module-init-failure"
  }
]
+ coreInitFlow("in-app-module-init")
