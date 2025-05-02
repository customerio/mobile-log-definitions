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
  },
  {
    id: 'core-sdk-init-already-initialized',
    label: 'Core SDK already initialized',
    tag: tags.initTag,
    log: 'CustomerIO instance is already initialized, skipping the initialization',
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
  },

  // Push init
  {
    id: 'push-module-init',
    label: 'Initializing Push module',
    tag: tags.initTag,
    log: 'Initializing SDK module MessagingPushFCM with config: {{config}}',
    next: 'push-google-services-available',
  },
  {
    id: 'push-google-services-available',
    label: 'Google Services available (Android only)',
    tag: tags.pushTag,
    log: 'Google Play Services is available for this device',
    next: 'push-module-success',
    'error': 'push-google-services-error',
  },
  {
    id: 'push-google-services-error',
    label: 'Google Services NOT available (Android only)',
    tag: tags.pushTag,
    log: 'Google Play Services is NOT available for this device with result: {{result}}',
  },
  {
    id: 'push-module-success',
    label: 'Push module init success',
    tag: tags.initTag,
    log: 'CustomerIO MessagingPushFCM module is initialized and ready to use',
    next: 'core-sdk-init-success',
  },


  {
    id: 'core-sdk-init-success',
    label: 'Core SDK init success',
    tag: tags.initTag,
    log: 'CustomerIO SDK is initialized and ready to use',
  }
]
