import axios from "axios";
import { toast } from "react-toastify";

export const downloadReport = async (token,url,filename) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
      responseType: 'blob',
    };
  
    try {
      const res = await axios.get(
        url,
        config
      );
      const blob = new Blob([res], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
  
      toast.success('Category downloaded.');
    } catch (error) {
      toast.error('Unable to fetch reports');
      console.error('Error:', error);
    }
  };