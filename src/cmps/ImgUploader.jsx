import { useState } from 'react'
import { uploadService } from '../services/upload.service'

export function ImgUploader({ onUploaded = null }) {
  const [isUploading, setIsUploading] = useState(false)

  async function uploadImg(ev) {
    setIsUploading(true)
    try {
      const url = await uploadService.uploadImg(ev)
      setIsUploading(false)
      if (onUploaded) onUploaded(url)
    } catch (err) {
      console.error('Failed to upload', err)
      setIsUploading(false)
    }
  }

  return (
    <div className="img-uploader-container">
      <label
        htmlFor="imgUpload"
        className="edit-btn"
        style={{
          backgroundColor: 'var(--gray-light)',
          fontWeight: '500',
          padding: '.6em .8em',
          borderRadius: '10px',
          fontSize: '.8rem',
          cursor: 'pointer'
        }}
      >
        {isUploading ? 'Uploading...' : 'Edit'}
      </label>

      <input
        type="file"
        onChange={uploadImg}
        accept="image/*"
        id="imgUpload"
        style={{ display: 'none' }}
      />
    </div>
  )
}