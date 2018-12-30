const convertUnderscoresToSpaces = (words) => {
  return words.split('_').join(' ');
}

const convertFilePathToDisplay = (path) => {
  const indexOfName = path.indexOf('_') + 1;
  const pathName = path.substr(indexOfName);
  return convertUnderscoresToSpaces(pathName);
}

const convertFilePathAndExtensionToDisplay = (path) => {
  const pathName = convertFilePathToDisplay(path);
  const indexOfExtension = pathName.indexOf('.md');
  return pathName.substr(0, indexOfExtension);
}

export {
  convertFilePathToDisplay,
  convertFilePathAndExtensionToDisplay
}