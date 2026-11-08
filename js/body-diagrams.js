/* Circles on the original category picture. x and y are the centre of the
   circle, as a percentage of that picture, so they stay on the part when
   the picture is scaled or moved. Only parts that can be seen on the
   picture are listed. The picture file is the group's own cover. */
const BODY_DIAGRAMS = {
  bones: {
    image: 'body/skeleton.webp',
    spots: [
      { id: 'skull', x: 50, y: 16 },
      { id: 'ribs', x: 42, y: 37 },
      { id: 'spine', x: 50, y: 45 },
      { id: 'femur', x: 43, y: 66 },
      { id: 'femur', x: 57, y: 66 }
    ]
  },
  muscles: {
    image: 'body/muscles.webp',
    spots: [
      { id: 'smile', x: 50, y: 25 },
      { id: 'biceps', x: 39, y: 49 },
      { id: 'biceps', x: 61, y: 49 },
      { id: 'tummy-muscles', x: 50, y: 51 },
      { id: 'calf', x: 43, y: 78 },
      { id: 'calf', x: 57, y: 78 }
    ]
  },
  heart: {
    image: 'body/blood.webp',
    spots: [
      { id: 'heart', x: 52, y: 45 },
      { id: 'blood-vessels', x: 44, y: 70 }
    ]
  },
  lungs: {
    image: 'body/breathing.webp',
    spots: [
      { id: 'windpipe', x: 50, y: 38 },
      { id: 'lungs', x: 43, y: 48 },
      { id: 'lungs', x: 57, y: 48 }
    ]
  },
  brain: {
    image: 'body/nerves.webp',
    spots: [
      { id: 'brain', x: 50, y: 14 },
      { id: 'spinal-cord', x: 50, y: 42 }
    ]
  },
  tummy: {
    image: 'body/tummy.webp',
    spots: [
      { id: 'mouth', x: 50, y: 27 },
      { id: 'liver', x: 44, y: 50 },
      { id: 'stomach', x: 55, y: 47 },
      { id: 'intestines', x: 50, y: 56 }
    ]
  },
  senses: {
    image: 'body/senses.webp',
    spots: [
      { id: 'ear', x: 18, y: 40 },
      { id: 'eye', x: 35, y: 42 },
      { id: 'nose', x: 52, y: 50 },
      { id: 'fingertips', x: 74, y: 68 }
    ]
  },
  skin: {
    image: 'body/skin.webp',
    spots: [
      { id: 'hair', x: 16, y: 34 },
      { id: 'teeth', x: 40, y: 46 },
      { id: 'skin', x: 40, y: 80 }
    ]
  },
  touch: {
    image: 'body/head.webp',
    spots: [
      { id: 'hand', x: 46, y: 14 },
      { id: 'hand', x: 55, y: 14 },
      { id: 'head', x: 50, y: 26 },
      { id: 'elbow', x: 22, y: 29 },
      { id: 'elbow', x: 78, y: 29 },
      { id: 'arm', x: 32, y: 24 },
      { id: 'shoulders', x: 38, y: 37 },
      { id: 'shoulders', x: 62, y: 37 }
    ]
  }
};
