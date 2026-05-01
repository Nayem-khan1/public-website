import fs from 'fs';
import path from 'path';
import { OfflineCenterSlider } from './OfflineCenterSlider';

export function OfflineCenterSection() {
  const offlineCenterDir = path.join(process.cwd(), 'public', 'offlineCenter');
  let images: string[] = [];
  
  try {
    if (fs.existsSync(offlineCenterDir)) {
      images = fs.readdirSync(offlineCenterDir)
        .filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpeg'))
        // Sort images so they appear in a consistent order
        .sort();
    }
  } catch (error) {
    console.error("Error reading offlineCenter directory:", error);
  }

  // If no images found, don't render the section
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="py-12 relative overflow-hidden z-10">
      <div className="container relative mx-auto px-4 md:px-6">
        <OfflineCenterSlider images={images} />
      </div>
    </section>
  );
}
