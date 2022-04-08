const express = require('express');
const multer  = require('multer');
const sharp = require('sharp');
const fs = require('fs');


const storageStrategy = multer.memoryStorage()
const upload = multer({ storage: storageStrategy })

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
  })
  
app.post('/image',upload.single('image'), async (req, res) => {
   
    const image=req.file
    console.log(image)

   try {

    if(image.size<5242880 && image.mimetype==='image/jpeg' || image.mimetype==='image/png'  ){

        const processedImageOne = sharp(image.buffer)
        const processedImageTwo = sharp(image.buffer)
        const processedImageThree = sharp(image.buffer)

        const resizedImageOne = processedImageOne.resize(400, 300,{
          fit: 'fill',
        })
        const resizedImageTwo = processedImageTwo.resize(160, 120,{
          fit: 'fill',
        })
        const resizedImageThree = processedImageThree.resize(120, 120,{
          fit: 'fill',
        })

        const resizedImageBufferOne = await resizedImageOne.toBuffer()
        const resizedImageBufferTwo = await resizedImageTwo.toBuffer()
        const resizedImageBufferThree = await resizedImageThree.toBuffer()
        
        fs.writeFileSync('thumbnails/thumbnailone.png', resizedImageBufferOne)
        fs.writeFileSync('thumbnails/thumbnailtwo.png', resizedImageBufferTwo)
        fs.writeFileSync('thumbnails/thumbnailthree.png', resizedImageBufferThree)
  
       // console.log(resizedImageBufferOne,resizedImageBufferTwo,resizedImageBufferThree)
  
          res.send({resizedImageOne: resizedImageBufferOne,
                    resizedImageTwo: resizedImageBufferTwo,
                    resizedImageThree: resizedImageBufferThree})
          
      } else{
          res.send('la image no es del tipo jpeg, png ó es mayor a 5MB')
      }
       
   } catch (error) {
       console.log(error)
   }

   
   
  })
  
  const  PORT  = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto', PORT)
  } )
