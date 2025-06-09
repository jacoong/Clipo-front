export const returnDefaultProfileImg = (value:string)=>{
    const num = parseInt(value.replace("default_", ""), 10); 
    switch (num) {
      case 1:
          return "text-blue-500";
          break;
      case 2:
          return "text-customGray";
          break;
      case 3:
          return "text-hovercustomBlack";
          break;
      case 4:
        return "text-customBlue";
          break;
      default:
         return "text-customBlue";
      }
}


export const returnDefaultBackgroundColor = (value:string)=>{
const num = parseInt(value.replace("bg_default_", ""), 10); 
switch (num) {
    case 1:
        return "bg-blue-500";
        break;
    case 2:
      return "bg-customGray";
        break;
    case 3:
      return "bg-hovercustomBlack";
        break;
    case 4:
      return "bg-customBlue";
        break;
    default:
      return "bg-customBlue";
    }
}