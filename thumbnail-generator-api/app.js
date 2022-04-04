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
  
app.post('/imagen',upload.single('imagen'), async (req, res) => {
   
    const imagen=req.file
    console.log(imagen)

   try {

    if(imagen.size<5242880 && imagen.mimetype==='image/jpeg' || imagen.mimetype==='image/png'  ){

        const processedImageOne = sharp(imagen.buffer)
        const processedImageTwo = sharp(imagen.buffer)
        const processedImageThree = sharp(imagen.buffer)

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
  
        console.log(resizedImageBufferOne,resizedImageBufferTwo,resizedImageBufferThree)
  
          res.send({resizedImageOne: resizedImageBufferOne,
                    resizedImageTwo: resizedImageBufferTwo,
                    resizedImageThree: resizedImageBufferThree})
          
      } else{
          res.send('la imagen no es del tipo jpeg, png ó es mayor a 5MB')
      }
       
   } catch (error) {
       console.log(error)
   }

   
   
  })
  
  const  PORT  = process.env.PORT || 3000

  console.log({PORT})

  app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto', PORT)
  } )
