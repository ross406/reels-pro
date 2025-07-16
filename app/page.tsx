"use client"
import ImageKit from "./components/ImageKit";
import { Image } from '@imagekit/next';

const IMAGE = 'https://ik.imagekit.io/ross406/izuku_midoriya_on_building_top_blue_sky_background_4k_hd_my_hero_academia_57immr1rVP.jpg?updatedAt=1752680879129'

export default function Home() {

  const onSuccess = (res) => {
    console.log('ImageKit upload success',res);

  }
  return (
   <>
      <ImageKit onSuccess={onSuccess}/>
       <Image
        urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
        src={IMAGE}
        width={500}
        height={500}
        alt="Picture of the author"
        loading="lazy"
        // transformation={[{ width: 500, height: 500 }]}
      />

      
     </> 
  );
}
