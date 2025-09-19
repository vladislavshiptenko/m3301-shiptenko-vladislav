function selectFile() {
  document.getElementById('photoInput').click();
}

document.addEventListener('DOMContentLoaded', function() {
  const { page, id } = getFromUrl();

  if (!id) {
    showMessage('Не удалось определить id', 'error');
    return;
  }

  if (!page) {
    showMessage('Не удалось определить страницу', 'error');
    return;
  }

  let selectedFile = null;

  function getFromUrl() {
    const path = window.location.pathname;
    const segments = path.split('/');

    if (segments[1] && segments[2]) {
      return {
        page: segments[1],
        id: segments[2],
      };
    }

    return null;
  }

  document.getElementById('photoInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    selectedFile = file;
    showFileInfo(file);
    showPreview(file);
    document.getElementById('uploadBtn').disabled = false;
  });

  document.getElementById('photoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!selectedFile) return;

    await uploadFile(selectedFile);
  });

  function validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      showMessage('Неподдерживаемый тип файла', 'error');
      return false;
    }

    if (file.size > maxSize) {
      showMessage('Файл слишком большой (макс. 5MB)', 'error');
      return false;
    }

    return true;
  }

  function showFileInfo(file) {
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatBytes(file.size);
    document.getElementById('fileInfo').style.display = 'block';
  }

  function showPreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('currentPhoto').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append('photo', file);

    const progressElement = document.getElementById('progress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    progressElement.style.display = 'block';

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          progressFill.style.width = percent + '%';
          progressText.textContent = percent + '%';
        }
      };

      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          showMessage('Аватар успешно загружен!', 'success');
          document.getElementById('currentPhoto').src = response.url;
        } else {
          showMessage('Ошибка загрузки', 'error');
        }
        resetForm();
      };

      xhr.onerror = function() {
        showMessage('Ошибка сети', 'error');
        resetForm();
      };

      xhr.open('POST', `/${page}/${id}/photo`);
      xhr.send(formData);
    } catch (error) {
      showMessage('Ошибка загрузки: ' + error.message, 'error');
      resetForm();
    }
  }

  function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = type;
  }

  function resetForm() {
    document.getElementById('progress').style.display = 'none';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('uploadBtn').disabled = true;
    document.getElementById('photoInput').value = '';
    selectedFile = null;
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  document.getElementById('currentPhoto').addEventListener('dragover', function(e) {
    e.preventDefault();
  });

  document.getElementById('currentPhoto').addEventListener('drop', function(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      selectedFile = file;
      showFileInfo(file);
      showPreview(file);
      document.getElementById('uploadBtn').disabled = false;
    }
  });
});
