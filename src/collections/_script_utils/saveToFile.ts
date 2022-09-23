import fs from "fs";

export const saveToFile = (
  data: {},
  fileName: string,
  minify: boolean = false
) => {
  const dataString = minify
    ? JSON.stringify(data)
    : JSON.stringify(data, null, 2);

  fs.writeFileSync(fileName, dataString);
  console.log(`Data saved to ${fileName}`);
};
