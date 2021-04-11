import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/********************************************************************
 * Font Awesome
 * SVG JavaScript Core
 * https://fontawesome.com/how-to-use/on-the-web/using-with/angular
 * https://fontawesome.com/icons
 */
// fas free-solid-svg-icons
import {
  faAngleDown,
  faAngleRight,
  faBars,
  faBook,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCircle,
  faDownload,
  faEnvelope,
  faHome,
  faMapPin,
  faMapSigns,
  faPaperPlane,
  faPhone,
  faSearch,
  faSlidersH,
} from '@fortawesome/free-solid-svg-icons';


// far free-regular-svg-icons
import { faSmile, } from '@fortawesome/free-regular-svg-icons';


// fab free-brands-svg-icons
import {
  faFacebookF,
  faGithub,
  faInstagram,
  faMediumM,
  faTwitter,
  faXing,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';


// fas pro-solid-svg-icons
// import {
//   faLightbulbOn as fasFaLightbulbOn
// } from '@fortawesome/pro-solid-svg-icons'


// far pro-regular-svg-icons
// import {
//   faLightbulbOn as farFaLightbulbOn,
//   faSearch as farFaSearch
// } from '@fortawesome/pro-regular-svg-icons';


// fal pro-light-svg-icons
// import {
//   faCircle as falFaCircle
// } from '@fortawesome/pro-light-svg-icons';


@NgModule({
  declarations: [],
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule],
  providers: []
})
export class FontawesomeModule {
  constructor(faIconLibrary: FaIconLibrary) {
    faIconLibrary.addIcons(
      // fas free-solid-svg-icons
      faAngleDown,
      faAngleRight,
      faBars,
      faBook,
      faCheck,
      faChevronDown,
      faChevronLeft,
      faChevronRight,
      faCircle,
      faDownload,
      faEnvelope,
      faHome,
      faMapPin,
      faMapSigns,
      faPaperPlane,
      faPhone,
      faSearch,
      faSlidersH,

      // far free-regular-svg-icons
      faSmile,

      // fab free-brands-svg-icons
      faFacebookF,
      faGithub,
      faInstagram,
      faMediumM,
      faTwitter,
      faXing,
      faYoutube,

      // fas pro-solid-svg-icons
      // fasFaLightbulbOn,

      // far pro-regular-svg-icons
      // farFaLightbulbOn,
      // farFaSearch,

      // fal pro-light-svg-icons
      // falFaCircle,
    );
  }
}
