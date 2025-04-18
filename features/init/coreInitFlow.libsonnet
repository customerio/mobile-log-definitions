function(nextId) [
  {
    id: "core-sdk-init",
    label: "Initializing core SDK",
    log: "[CIO][Init] Initializing core SDK with prams: {...}",
    success: "core-sdk-init-success",
    "error": "core-sdk-init-failure"
  },
  {
    id: "core-sdk-init-success",
    label: "Core SDK init success",
    log: "[CIO][Init] Core SDK init success!",
  } + (if std.isString(nextId) then { next: nextId } else {})
  ,
  {
    id: "core-sdk-init-failure",
    label: "Core SDK init failed",
    log: "[CIO][Init] Core SDK init success with error: {...}"
  }
]