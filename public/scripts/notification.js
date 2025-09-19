window.NotificationManager = {
  eventSource: null,
  counter: 0,
  settings: {
    userId: null
  },

  connect: function(options = {}) {
    this.settings = { ...this.settings, ...options };

    const params = new URLSearchParams();
    if (this.settings.userId) {
      params.set('userId', this.settings.userId);
    }

    const url = `/notifications/stream?${params.toString()}`;
    this.eventSource = new EventSource(url);

    this.setupEventHandlers();
    this.setupToastr();
    this.setupUI();
  },

  setupEventHandlers: function() {
    this.eventSource.onopen = () => {
      this.updateStatus('connected', 'Подключено');
      console.log('SSE подключение установлено');
    };

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleNotification(data);
    };

    this.eventSource.onerror = (event) => {
      this.updateStatus('error', 'Ошибка');
      console.error('SSE ошибка:', event);

      setTimeout(() => {
        if (this.eventSource.readyState === EventSource.CLOSED) {
          this.connect(this.settings);
        }
      }, 5000);
    };

    this.eventSource.addEventListener('connected', (event) => {
      const data = JSON.parse(event.data);
      toastr.info(data.message, data.title);
    });
  },

  disconnect: function() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.updateStatus('disconnected', 'Отключено');
      console.log('SSE соединение закрыто');
    }
  },

  setupToastr: function() {
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      positionClass: "toast-top-right",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "8000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut"
    };
  },

  setupUI: function() {
    if (!document.getElementById('notification-status')) {
      this.createStatusUI();
    }

    const counter = document.querySelector('.notification-counter');
    if (counter) {
      counter.addEventListener('click', () => {
        this.resetCounter();
      });
    }
  },

  createStatusUI: function() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'notification-status';
    statusDiv.className = 'notification-status';
    statusDiv.innerHTML = `
            <span class="status-indicator"></span>
            <span class="status-text">Подключение...</span>
            <div class="notification-counter">0</div>
        `;
    document.body.appendChild(statusDiv);
  },

  handleNotification: function(data) {
    if (data.type === 'heartbeat') {
      return;
    }

    this.counter++;
    this.updateCounter();

    switch (data.messageType) {
      case 'success':
        toastr.success(data.message, data.title);
        break;
      case 'info':
        toastr.info(data.message, data.title);
        break;
      case 'warning':
        toastr.warning(data.message, data.title);
        break;
      case 'error':
        toastr.error(data.message, data.title, {
          timeOut: 0,
          extendedTimeOut: 0,
        });
        break;
      default:
        toastr.info(data.message, data.title);
    }
  },

  updateCounter: function() {
    const counter = document.querySelector('.notification-counter');
    if (counter) {
      counter.textContent = this.counter;
      counter.classList.add('pulse');
      setTimeout(() => {
        counter.classList.remove('pulse');
      }, 300);
    }
  },

  resetCounter: function() {
    this.counter = 0;
    this.updateCounter();
  },

  updateStatus: function(status, text) {
    const indicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');

    if (indicator) {
      indicator.className = `status-indicator ${status}`;
    }
    if (statusText) {
      statusText.textContent = text;
    }
  },
};

window.addEventListener('beforeunload', () => {
  window.NotificationManager.disconnect();
});

