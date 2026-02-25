import { LanguageSwitcher as SharedLanguageSwitcher } from "@kwim/shared-ui";
import france from "../../assets/img/lang/france.png";
import english from "../../assets/img/lang/english.png";

const LanguageSwitcher = () => {
  const languages = [
    { code: "fr", name: "Français", flag: france },
    { code: "en", name: "English", flag: english },
  ];

  return <SharedLanguageSwitcher languages={languages} />;
};

export default LanguageSwitcher;
