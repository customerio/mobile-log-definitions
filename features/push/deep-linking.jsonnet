local tags = import '../tags.libsonnet';

[
  {
    id: 'handling-push-deep-link-start',
    label: 'Handling push deep linking',
    tag: tags.initTag,
    log: 'Handling push notification deep link with payload: {payload}',
    next: 'push-deep-link-handled-callback',
    'error': 'push-deep-link-not-handled'
  },
  {
    id: 'push-deep-link-not-handled',
    label: 'Push deep link not handled',
    tag: tags.initTag,
    log: 'Push notification deep link not handled'
  },
  {
    id: 'push-deep-link-handled-callback',
    label: 'Push deep link handled by host app callback',
    tag: tags.initTag,
    log: 'Deep link handled by host app callback implementation',
    next: 'push-deep-link-handled-host-app'
  },
  {
    id: 'push-deep-link-handled-host-app',
    label: 'Push deep link handled by host app',
    tag: tags.initTag,
    log: 'Deep link handled by internal host app navigation',
    next: 'push-deep-link-handled-externally'
  },
  {
    id: 'push-deep-link-handled-externally',
    label: 'Push deep link handled externally',
    tag: tags.initTag,
    log: 'Deep link handled by external app'
  }
]
