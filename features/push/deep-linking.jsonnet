local tags = import '../tags.libsonnet';

[
  {
    id: 'handling-push-deep-link-start',
    label: 'Handling push deep linking',
    tag: tags.initTag,
    log: 'Handling push notification deep link with payload: {payload}',
    next: 'push-deep-link-handled-callback',
    'error': 'push-deep-link-not-handled',
    description: 'This log point means that the SDK is attempting to handle a deep link for clicked push notification message'
  },
  {
    id: 'push-deep-link-not-handled',
    label: 'Push deep link not handled',
    tag: tags.initTag,
    log: 'Push notification deep link not handled',
    description: 'This log point means that the SDK did not handle a push message deep linking, most likely due to the absence of a deep link, please check the payload of the previous log to check if a valid deep link is present'
  },
  {
    id: 'push-deep-link-handled-callback',
    label: 'Push deep link handled by host app callback',
    tag: tags.initTag,
    log: 'Deep link handled by host app callback implementation',
    next: 'push-deep-link-handled-host-app',
    description: 'This log point means that we have used the customer provided deep linking callback to handle the deep link. This means that customers callback code handled the deep link resulting in the SDK not doing any more handling for the deep link'
  },
  {
    id: 'push-deep-link-handled-host-app',
    label: 'Push deep link handled by host app',
    tag: tags.initTag,
    log: 'Deep link handled by internal host app navigation',
    next: 'push-deep-link-handled-externally',
    description: 'This log point means that the SDK handled the push message deep link using an internal host app screen deep that was setup by the customer'
  },
  {
    id: 'push-deep-link-handled-externally',
    label: 'Push deep link handled externally',
    tag: tags.initTag,
    log: 'Deep link handled by external app',
    description: 'This log point means that the push message deep link was handled by the platform system, most likely by using an external app like the browser'
  }
]
