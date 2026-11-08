/* Circles on the original category picture. x and y are the centre, as a
   percentage of that picture, so they stay on the part when it is zoomed
   or moved. One circle per part, only where that part is actually visible.
   The picture file is the group's own cover. */
const BODY_DIAGRAMS = {
  bones: {
    image: 'body/skeleton.webp',
    spots: [
      { id: 'skull', x: 50, y: 11 },
      { id: 'jaw', x: 50, y: 21 },
      { id: 'collarbone', x: 47, y: 31 },
      { id: 'humerus', x: 39, y: 42 },
      { id: 'ribs', x: 56, y: 36 },
      { id: 'spine', x: 50, y: 45 },
      { id: 'forearm', x: 36, y: 52 },
      { id: 'pelvis', x: 46, y: 54 },
      { id: 'femur', x: 45, y: 66 },
      { id: 'shin', x: 43, y: 80 }
    ]
  },
  muscles: {
    image: 'body/muscles.webp',
    spots: [
      { id: 'smile', x: 50, y: 30 },
      { id: 'neck-muscle', x: 50, y: 38 },
      { id: 'shoulder-muscle', x: 42, y: 40 },
      { id: 'chest-muscles', x: 60, y: 43 },
      { id: 'biceps', x: 40, y: 50 },
      { id: 'tummy-muscles', x: 50, y: 54 },
      { id: 'forearm-muscles', x: 66, y: 54 },
      { id: 'thigh-muscle', x: 46, y: 64 },
      { id: 'calf', x: 42, y: 78 }
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
      { id: 'lungs', x: 43, y: 48 }
    ]
  },
  brain: {
    image: 'body/nerves.webp',
    spots: [
      { id: 'brain', x: 50, y: 14 },
      { id: 'spinal-cord', x: 50, y: 42 },
      { id: 'nerves', x: 36, y: 49 }
    ]
  },
  tummy: {
    image: 'body/tummy.webp',
    spots: [
      { id: 'mouth', x: 50, y: 27 },
      { id: 'food-pipe', x: 50, y: 38 },
      { id: 'liver', x: 43, y: 48 },
      { id: 'stomach', x: 54, y: 48 },
      { id: 'intestines', x: 50, y: 58 }
    ]
  },
  senses: {
    image: 'body/senses.webp',
    spots: [
      { id: 'ear', x: 18, y: 40 },
      { id: 'eye', x: 42.5, y: 42 },
      { id: 'nose', x: 52, y: 50 },
      { id: 'fingertips', x: 74, y: 68 }
    ]
  },
  skin: {
    image: 'body/skin.webp',
    spots: [
      { id: 'hair', x: 16, y: 34 },
      { id: 'teeth', x: 40, y: 43 },
      { id: 'skin', x: 40, y: 80 }
    ]
  },
  touch: {
    image: 'body/head.webp',
    spots: [
      { id: 'hand', x: 50, y: 14 },
      { id: 'head', x: 50, y: 26 },
      { id: 'elbow', x: 25, y: 32 },
      { id: 'arm', x: 32, y: 23 },
      { id: 'neck', x: 50, y: 36 },
      { id: 'shoulders', x: 64, y: 37 }
    ]
  }
};
