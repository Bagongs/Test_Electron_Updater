import React, { useEffect, useState } from 'react';

function App() {
  const [updateStatus, setUpdateStatus] = useState('');
  const [progress, setProgress] = useState(0);

  // Fungsi untuk memeriksa pembaruan
  const checkForUpdates = () => {
    window.electron.ipcRenderer.send('check-for-updates');
    console.log('Memicu pemeriksaan pembaruan...');
    };

  // Fungsi untuk memulai ulang aplikasi
  const restartApp = () => {
    window.electron.ipcRenderer.send('restart-app');
  };

  // Dengarkan acara dari proses utama
  useEffect(() => {
    window.electron.ipcRenderer.on('update-status', (status) => {
      console.log('Status Pembaruan:', status);
      setUpdateStatus(status);
    });

    window.electron.ipcRenderer.on('update-progress', (percent) => {
      console.log(`Progres Unduhan: ${percent}%`);
      setProgress(percent);
    });

    window.electron.ipcRenderer.on('update-error', (error) => {
      console.error('Kesalahan Pembaruan:', error);
      alert(`Pembaruan gagal: ${error}`);
    });

    return () => {
      // Bersihkan listener saat komponen dibongkar
      window.electron.ipcRenderer.removeAllListeners('update-status');
      window.electron.ipcRenderer.removeAllListeners('update-progress');
      window.electron.ipcRenderer.removeAllListeners('update-error');
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Electron-Vite React OTA Update Version 1.0.1</h1>
      <p style={styles.description}>
        Aplikasi ini mendukung pembaruan otomatis menggunakan Electron-Updater.
      </p>

      {/* Tombol untuk memeriksa pembaruan */}
      <button onClick={checkForUpdates} style={styles.button}>
        Periksa Pembaruan
      </button>

      {/* Status pembaruan */}
      <div style={styles.statusContainer}>
        <p>{updateStatus}</p>
        {progress > 0 && (
          <p>
            Mengunduh... {progress.toFixed(2)}%
          </p>
        )}
      </div>

      {/* Tombol untuk memulai ulang aplikasi */}
      {updateStatus.includes('diunduh') && (
        <button onClick={restartApp} style={styles.button}>
          Mulai Ulang Aplikasi
        </button>
      )}
    </div>
  );
}

// Gaya CSS sederhana
const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  description: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '30px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  statusContainer: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#333',
  },
};

export default App;