local tags = import '../tags.libsonnet';

[
  // Core SDK init
  {
    id: 'core-sdk-init',
    label: 'Initializing core SDK',
    tag: tags.initTag,
    log: 'Creating new instance of CustomerIO SDK version: {{version}}...',
    next: 'data-pipelines-module-init',
    'error': 'core-sdk-init-already-initialized',
    description: 'This is the main entry point for SDK integration, this log point is required to indicate that the SDK is integrated and init code added to the customer host app'
  },
  {
    id: 'core-sdk-init-already-initialized',
    label: 'Core SDK already initialized',
    tag: tags.initTag,
    log: 'CustomerIO instance is already initialized, skipping the initialization',
    description: 'This event means that the SDK was initialized more than once, which could indicate an integration bug by the customer, we recommend that the SDK is initialized only once per application launch'
  },

  // DataPipelines init
  {
    id: 'data-pipelines-module-init',
    label: 'Initializing DataPipelines module',
    tag: tags.initTag,
    log: 'Initializing SDK module DataPipelines with config: {{config}}',
    success: 'data-pipelines-module-success',
  },
  {
    id: 'data-pipelines-module-success',
    label: 'DataPipelines module init success',
    tag: tags.initTag,
    log: 'CustomerIO DataPipelines module is initialized and ready to use',
    next: 'push-module-init',
    description: 'This log point means that the Data Pipelines module was initialized successfully, the absence of this log point means the SDK integration was not done correctly and it will impact the customer ability to perform critical SDK functionality like identify, track and other functionalities'
  },

  // Push init
  {
    id: 'push-module-init',
    label: 'Initializing Push module',
    tag: tags.initTag,
    log: 'Initializing SDK module MessagingPushFCM with config: {{config}}',
    next: 'pulling-current-push-token',
  },
  {
    id: 'pulling-current-push-token',
    label: 'Pull push token (Android only)',
    tag: tags.pushTag,
    log: 'Getting current device token from Firebase messaging on app launch',
    next: 'push-google-services-available',
    'error': 'pulling-current-push-token-failed',
  },
  {
    id: 'pulling-current-push-token-failed',
    label: 'Pull push token failed (Android only)',
    tag: tags.pushTag,
    log: 'Failed to get device token with error: {{errorMessage}}',
    description: "The presence of this log point means that the token retrieval has failed, thus device won't be added to identified profile and push functionality will not work"
  },
  {
    id: 'push-google-services-available',
    label: 'Google Services available (Android only)',
    tag: tags.pushTag,
    log: 'Google Play Services is available for this device',
    next: 'push-module-success',
    'error': 'push-google-services-error',
    description: "The presence of this log point means that the device the customer is using to test doesn't have Google Play Services available, thus device won't be added to identified profile and push functionality will not work"
  },
  {
    id: 'push-google-services-error',
    label: 'Google Services NOT available (Android only)',
    tag: tags.pushTag,
    log: 'Google Play Services is NOT available for this device with result: {{result}}',
    description: "The presence of this log point means that the device the customer is using to test doesn't have Google Play Services available, thus device won't be added to identified profile and push functionality will not work"
  },
  {
    id: 'push-module-success',
    label: 'Push module init success',
    tag: tags.initTag,
    log: 'CustomerIO MessagingPushFCM module is initialized and ready to use',
    next: 'core-sdk-init-success',
    description: 'This log point means that the Push Notifications module was initialized successfully, the absence of this log point means the SDK integration was not done correctly and it will impact the customer ability to add devices to profiles and receive push notifications'
  },


  {
    id: 'core-sdk-init-success',
    label: 'Core SDK init success',
    tag: tags.initTag,
    log: 'CustomerIO SDK is initialized and ready to use',
    next: 'pulled-current-push-token'
  },

  // Push token setup
  {
    id: 'pulled-current-push-token',
    label: 'Obtained current device token (Android only)',
    tag: tags.pushTag,
    log: 'Got current device token: {{token}}',
    next: 'storing-push-token',
    description: 'This log point means that the SDK was able to obtain device push token and the device will be added to an identified profile and device is ready to receive push messages'
  },
  {
    id: 'storing-push-token',
    label: 'Storing device token',
    tag: tags.pushTag,
    log: 'Storing device token: {{token}}',
    next: 'registering-push-token'
  },
  {
    id: 'registering-push-token',
    label: 'Registering device token',
    tag: tags.pushTag,
    log: 'Registering device token: {{token}}',
    next: 'automatic-profile-push-token-registration'
  },

  {
    id: 'automatic-profile-push-token-registration',
    label: 'Automatically registering token to profile',
    tag: tags.pushTag,
    log: 'Automatically registering device token: {{token}} to newly identified profile: {{userId}}',
    next: 'push-notification-delivered',
    description: 'This log point means that the device push token will be automatically linked to identified profile and customer can send push messages to this profile device'
  },
  {
    id: 'push-notification-delivered',
    label: 'Push notification delivered',
    tag: tags.pushTag,
    log: 'Tracking push message delivered with deliveryId: {{deliveryId}}',
    next: 'show-push-notification',
    description: 'This log point means a push message was received by the device, at this point the push has not necessarily been shown yet'
  },
  {
    id: 'show-push-notification',
    label: 'Showing push notification (Android only)',
    tag: tags.pushTag,
    log: 'Showing notification for message: {{message}}',
    next: "push-notification-opened",
    description: 'This log point means that a push message that was received will be shown as local notification on the device'
  },
  {
    id: 'push-notification-opened',
    label: 'Push notification opened',
    tag: tags.pushTag,
    log: 'Tracking push message opened with payload: {{payload}}',
    description: 'This log point means that a push message was received, shown and clicked by the customer user'
  }
]
