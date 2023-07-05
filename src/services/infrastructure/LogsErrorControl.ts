import fs from 'fs';
 function saveErrorToLogFile(error: unknown, errorLine: string) {
  try {
    const currentDate = new Date();
    const formattedFullDate = currentDate.toLocaleString();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    const logFileName = `error-logs-${formattedDate}.log`;
    const logFilePath = `src/logs/${logFileName}`;
    const logMessage = `${formattedFullDate}    ${error}    ${errorLine}\n`;
     if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, logMessage);
    } else {
      fs.appendFileSync(logFilePath, logMessage);
    }
  } catch (error) {
    console.error('Error saving error to log file:', error);
  }
}
 export default saveErrorToLogFile;