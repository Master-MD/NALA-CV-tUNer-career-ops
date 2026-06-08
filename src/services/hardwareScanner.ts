import os from 'os';
import { exec } from 'child_process';
import net from 'net';
import fs from 'fs';
import path from 'path';

export interface HardwareInfo {
  platform: string;
  cpuModel: string;
  cpuCores: number;
  totalRamGb: number;
  freeDiskGb: number;
}

export interface ServiceStatus {
  ollamaRunning: boolean;
  comfyUiRunning: boolean;
  qdrantRunning: boolean;
  mcpRunning: boolean;
  ollamaPort: number;
}

export class HardwareScanner {
  // Check system specifications
  static getHardwareInfo(): Promise<HardwareInfo> {
    return new Promise((resolve) => {
      const platform = os.platform();
      const cpuModel = os.cpus()[0]?.model || 'Unknown CPU';
      const cpuCores = os.cpus().length;
      const totalRamGb = Math.round(os.totalmem() / (1024 * 1024 * 1024));

      let freeDiskGb = 50; // Fallback default
      
      // Determine free disk space dynamically based on platform
      const checkCommand = platform === 'win32'
        ? 'wmic logicaldisk where "DeviceID=\'C:\'" get FreeSpace'
        : 'df -k / | tail -1 | awk \'{print $4}\'';

      exec(checkCommand, (error, stdout) => {
        if (!error && stdout) {
          try {
            if (platform === 'win32') {
              const matches = stdout.match(/\d+/);
              if (matches) {
                freeDiskGb = Math.round(parseInt(matches[0], 10) / (1024 * 1024 * 1024));
              }
            } else {
              // df returns size in KB
              freeDiskGb = Math.round(parseInt(stdout.trim(), 10) / (1024 * 1024));
            }
          } catch (e) {
            // keep default fallback
          }
        }
        resolve({
          platform,
          cpuModel,
          cpuCores,
          totalRamGb,
          freeDiskGb
        });
      });
    });
  }

  // Scan local TCP ports to verify active services
  static async scanServices(): Promise<ServiceStatus> {
    const ollamaPort = 11434;
    const comfyUiPort = 7860;
    const qdrantPort = 6333;
    const mcpPort = 3000;

    const ollamaRunning = await this.checkPort(ollamaPort);
    const comfyUiRunning = await this.checkPort(comfyUiPort) || await this.checkPort(8188);
    const qdrantRunning = await this.checkPort(qdrantPort);
    const mcpRunning = await this.checkPort(mcpPort);

    return {
      ollamaRunning,
      comfyUiRunning,
      qdrantRunning,
      mcpRunning,
      ollamaPort
    };
  }

  // Helper method to check TCP port connection
  private static checkPort(port: number, host = '127.0.0.1'): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      const onError = () => {
        socket.destroy();
        resolve(false);
      };
      socket.setTimeout(300);
      socket.once('error', onError);
      socket.once('timeout', onError);
      socket.connect(port, host, () => {
        socket.end();
        resolve(true);
      });
    });
  }

  // Checks standard system installation paths for Ollama
  static checkOllamaInstalled(): boolean {
    const platform = os.platform();
    if (platform === 'win32') {
      const localAppData = process.env.LOCALAPPDATA || '';
      const programFiles = process.env.ProgramFiles || '';
      const winPath1 = path.join(localAppData, 'Programs', 'Ollama', 'ollama.exe');
      const winPath2 = path.join(programFiles, 'Ollama', 'ollama.exe');
      return fs.existsSync(winPath1) || fs.existsSync(winPath2);
    } else if (platform === 'darwin') {
      return fs.existsSync('/Applications/Ollama.app');
    } else {
      // Linux/Unix check
      try {
        exec('which ollama', { stdio: 'ignore' });
        return true;
      } catch {
        return false;
      }
    }
  }
}
