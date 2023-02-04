import {ResponsiveImage} from "../../00-Base/Types/ResponsiveImage"


export const Image = (image: ResponsiveImage) => {
  return (
    <picture className="a-responsive-image">
      {image.large &&
        <source srcSet={image.large.src} media="(min-width: 640px)"/>
      }

      {image.medium &&
        <source srcSet={image.medium.src} media="(min-width: 640px)"/>
      }

      <img src={image.small.src} srcSet={image.small.src} alt={image.small.alt} loading="lazy"/>
    </picture>
  )
}