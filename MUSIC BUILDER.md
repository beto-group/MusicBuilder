
```datacorejsx
const activeFile = dc.resolvePath("MUSIC BUILDER") || "_RESOURCES/DATACORE/MUSIC BUILDER/MUSIC BUILDER";
const folderPath = activeFile.substring(0, activeFile.lastIndexOf('/'));
const { View } = await dc.require(folderPath + "/src/index.jsx");
return await View({ folderPath, dc });
```
