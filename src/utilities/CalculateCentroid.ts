const calculateMiddlePoint = (data:any) => {
  // Extract coordinates
  console.log(data)
  const coordinates = data.map((feature:any) => feature.position);
  console.log(coordinates)
  // Calculate the average of the latitudes and longitudes (swapping their positions)
  const middlePoint = coordinates.reduce((acc:any, coord:any) => {
    acc[0] += coord[0]; // latitude
    acc[1] += coord[1]; // longitude
    return acc;
  }, [0, 0]).map((coord:any) => coord / coordinates.length);

  return middlePoint;
};

export default calculateMiddlePoint;
