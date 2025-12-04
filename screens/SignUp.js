import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react'
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const BackArrowIcon = () => (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <Path fill="#565656" d="m5.543 9.208 3.47 3.471a.65.65 0 0 1 .205.496.71.71 0 0 1-.222.496.75.75 0 0 1-.496.204.647.647 0 0 1-.496-.204L3.33 8.996a.625.625 0 0 1-.15-.23.827.827 0 0 1 .001-.531.606.606 0 0 1 .15-.23l4.675-4.676a.661.661 0 0 1 .487-.195.72.72 0 0 1 .505.195.69.69 0 0 1 .212.505c0 .195-.07.363-.212.505L5.543 7.792h7.915c.201 0 .37.068.505.204a.683.683 0 0 1 .204.504.69.69 0 0 1-.204.505.677.677 0 0 1-.505.203H5.543Z"/>
    </Svg>
);
const EyeIcon = () =>(
  <Svg width="32" height="32" fill="none">
    <Path fill="#565656" d="M15 11.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm0 10a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5Zm0-15.625C8.75 5.625 3.412 9.512 1.25 15c2.163 5.488 7.5 9.375 13.75 9.375S26.587 20.488 28.75 15C26.587 9.512 21.25 5.625 15 5.625Z"/>
  </Svg>
);
const EyeClosedIcon = () =>(
  <Svg width="30" height="27" fill="none">
    <Path fill="#565656" d="M16.237 12.922A3.25 3.25 0 0 0 13 9.75l3.237 3.172Z" />
    <Path fill="#565656" d="M10.66 7.67A5.72 5.72 0 0 1 13 7.15 5.85 5.85 0 0 1 18.85 13a5.59 5.59 0 0 1-.377 2.015l3.627 3.367A18.2 18.2 0 0 0 26 13s-3.9-9.1-13-9.1a12.48 12.48 0 0 0-5.2 1.105l2.86 2.665ZM2.6 2.6 1.3 3.9l3.315 3.12A18.07 18.07 0 0 0 0 13s3.9 9.1 13 9.1a12.61 12.61 0 0 0 6.032-1.508L23.4 24.7l1.3-1.3L2.6 2.6ZM13 18.85A5.85 5.85 0 0 1 7.15 13a5.785 5.785 0 0 1 .78-2.86l1.989 1.872A3.25 3.25 0 0 0 9.75 13a3.237 3.237 0 0 0 4.433 3.016l2.002 1.885c-.947.62-2.054.95-3.185.949Z" />
  </Svg>
);
const Illustration = () =>(
  <Svg width={306} height={224} viewBox="0 0 306 224" fill="none">
    <Path
      fill="#000"
      d="M237.109 94.73c-.487 0-.487.873 0 .873 1.16 0 17.319-.257 18.676-.515a.527.527 0 0 0 .318-.17.496.496 0 0 0 0-.657.528.528 0 0 0-.318-.17c-4.257-.537-13.99.549-18.676.639Zm6.473 22.87c-.534 0-.441.862.069.885 3.782.123 9.675-.067 13.538-.235.707 0 .788-1.12 0-1.12-4.327.022-9.269.078-13.607.47Zm.499-38.629a.472.472 0 0 0-.301.124.439.439 0 0 0-.054.588c.066.088.164.15.273.173 2.077.246 8.816.504 10.846-.325a.52.52 0 0 0 .24-.23.499.499 0 0 0-.116-.61.542.542 0 0 0-.309-.134c-2.691-.157-7.007.672-10.579.414Zm-13.248 21.639c9.791-.135 20.88-.796 30.764-1.67.614 0 .556-1.12-.082-1.12-9.72.236-21.077.852-30.74 1.815a.513.513 0 0 0-.348.163.476.476 0 0 0 .041.689c.1.086.232.13.365.123Zm14.036-49.885c2.726-.202 5.452-.359 8.12-.672.766-.079.569-1.12-.185-1.12-2.715.201-5.429.537-8.12.84-.627.067-.453.997.185.952Zm-15.915 23.363c-.58 0-.603.952 0 .997a87.513 87.513 0 0 0 19.581-1.322c.731-.123.615-1.243-.128-1.12a109.717 109.717 0 0 1-19.453 1.445Zm21.588-17.998c1.009.235 1.16-1.356.232-1.199a71.885 71.885 0 0 1-13.7.818c-.615 0-.754.862-.127.93 4.535.44 9.113.254 13.595-.55Zm-25.126 43.993c-.905-.336-5.081.224-6.252.347-.569 0-.592.885 0 .874l4.744-.146c2.193-.078 2.181-.817 1.508-1.075Zm4.791 48.463c-.974-.224-7.9.28-9.036.347-.604 0-.488.896.116.885 1.229 0 7.969 0 9.036-.325.476-.157.313-.818-.116-.907Zm-9.048-4.738c3.26.146 11.333.28 14.593-.47a.571.571 0 0 0 .403-.177.516.516 0 0 0-.087-.776.566.566 0 0 0-.432-.089c-4.768 0-9.187.773-14.338.571-.615-.022-.777.907-.139.941Zm11.252-19.914c.696-.123.638-1.12-.093-1.12-5.15.504-6.229.628-11.507.829-.51 0-.568.851 0 .885 3.877.249 7.772.049 11.6-.594Zm7.146-7.044c-6.311.224-12.865 1.254-19.454 1.478a.506.506 0 0 0-.302.162.473.473 0 0 0-.121.314c0 .115.043.226.121.314a.5.5 0 0 0 .302.162c5.464 0 14.257-.246 19.581-1.389a.56.56 0 0 0 .264-.23.535.535 0 0 0-.079-.647.575.575 0 0 0-.312-.164Zm21.494 28.952c-.092 0-6.461.504-7.551.47a.492.492 0 0 0-.27.141.459.459 0 0 0-.065.559.485.485 0 0 0 .23.196c1.3.235 6.775.325 7.9-.594a.463.463 0 0 0 .105-.453.461.461 0 0 0-.13-.204.493.493 0 0 0-.219-.115Zm2.054-24.428c-8.039.504-17.018.796-25.022 1.456-.626 0-.51.908.093.941 4.327.123 19.72-.638 25.033-1.288a.58.58 0 0 0 .393-.196.545.545 0 0 0 .129-.409.559.559 0 0 0-.206-.376.597.597 0 0 0-.42-.128ZM232.91 95.906a.59.59 0 0 0 .41-.164.55.55 0 0 0 0-.792.59.59 0 0 0-.41-.164c-5 .123-10.046.156-15.08.526a.494.494 0 0 0-.275.165.462.462 0 0 0 0 .589c.07.083.167.141.275.164 5.057.09 10.08-.168 15.08-.324Zm19.778 45.214c-1.763 0-8.12.437-9.628.694-.487.079-.557.852 0 .874 1.635.078 7.957-.314 9.79-.47.708.022.557-1.098-.162-1.098Zm-3.387 6.283-14.582.896c-.661 0-.498.975.151.941 2.831-.123 11.937-.47 14.489-.806.568-.068.58-1.031-.058-1.031Zm-10.44-97.35c-4.281-.47-17.714.313-22.272.761-.627.056-.673.997 0 .941 7.493-.47 14.79-.627 22.283-.605a.585.585 0 0 0 .332-.197.546.546 0 0 0-.008-.709.581.581 0 0 0-.335-.191Zm1.241 30.229c.731-.101.464-1.12-.267-1.12a188.423 188.423 0 0 1-22.492 1.12.467.467 0 0 0-.28.151.437.437 0 0 0 0 .582.467.467 0 0 0 .28.151c7.598.354 15.214.058 22.759-.884Zm-7.877-23.453a.588.588 0 0 0 .394-.203.547.547 0 0 0 .063-.624.58.58 0 0 0-.573-.294c-5.115.617-9.964.64-15.01 1.065-.534.056-.592.896 0 .918 5.057.08 10.114-.21 15.126-.862Zm-14.372 17.73c-.58 0-.592.884.07.907 2.081.189 4.174.241 6.264.156a.529.529 0 0 0 .23-.19.503.503 0 0 0 0-.56.529.529 0 0 0-.23-.19c-.209-.112-5.267-.124-6.334-.124Zm-14.477 6.45c.673 0 3.167-3.987 4.571-5.353.51-.493-.325-1.322-.847-.851a20.344 20.344 0 0 0-3.805 4.413l-2.935-2.61c-.603-.538-1.38.38-.823.93.556.548 2.981 3.472 3.839 3.472Zm-7.934-18.289c4.756.269 9.697.18 14.917.213.372 0 .592-.997 0-12.891 0-.863-.081-1.501-.092-1.736a.238.238 0 0 0-.07-.19c-.336-.348-2.529-.326-7.459-.202-8.294.19-9.21.134-9.21.593-.035.09.487 14.079 1.914 14.213Zm.325-.829c-.58-2.99-.998-9.307-1.358-12.846 3.376.19 11.067-.18 14.941-.269 0 0 .209 9.957.302 13.171-4.547-.1-9.292-.269-13.932-.112l.047.056Z"
    />
    <Path
      fill="#000"
      d="M211.96 83.933c.974-.37-.162-10.808-.325-13.552a.235.235 0 0 0-.081-.146c-.696-.582-15.416.19-16.159.247-.742.056 0 3.953.128 6.608.267 6.608.58 7.179.928 7.224 2.529.347 13.189.492 15.509-.381ZM196.103 71.4c5.023-.314 10.115-.336 14.639-.358.116 2.62.302 10.001.534 11.995a98.998 98.998 0 0 1-14.234.392c.198-1.669-.765-10.136-.939-12.029Zm9.442 28.28 2.691-2.352a.684.684 0 0 0-.079-.825.755.755 0 0 0-.837-.183 13.563 13.563 0 0 0-2.97 2.386l-2.412-2.15a.689.689 0 0 0-.952.033.637.637 0 0 0 .035.918l2.32 2.24c-2.088 2.128-3.004 3.461-2.795 4.066.208.605.962.336 1.16.067.812-.963 1.728-2.061 2.714-3.08a21.013 21.013 0 0 0 3.236 2.778.721.721 0 0 0 .684-.192.654.654 0 0 0 .152-.671 20.922 20.922 0 0 0-2.947-3.035Zm.615-48.014a18.09 18.09 0 0 0-4.454 5.6 15.543 15.543 0 0 0-2.993-2.666c-.685-.46-1.566.414-.893.907a35.876 35.876 0 0 1 3.7 3.651c.302.303.592.146.847-.179a32.857 32.857 0 0 1 4.64-6.608c.557-.593-.244-1.254-.847-.705Zm-.371 73.124c.603-.403 2.9-4.681 4.234-6.137.522-.56-.383-1.333-.975-.739A24.697 24.697 0 0 0 205 123.2l-2.703-2.24c-.591-.482-1.38.381-.765.952.614.571 3.259 3.707 4.257 2.878Zm8.851 14.359c-.441-.84-16.31 0-16.461 0a.212.212 0 0 0-.096.036.202.202 0 0 0-.066.076c-.534.829 0 14.302.383 15.557.452 1.523 15.834.257 16.599.324a.167.167 0 0 0 .134-.028.16.16 0 0 0 .045-.052.147.147 0 0 0 .018-.065c.244-1.714-.498-15.736-.556-15.848Zm-15.718.817c4.64.191 10.126-.089 14.836-.1.07 1.87.487 12.846.545 14.324-5.15.224-9.477.146-14.964 0 .058-1.87-.348-12.521-.417-14.19v-.034Z"
    />
    <Path
      fill="#000"
      d="M204.524 147.224c.824 0 5.035.28 5.371.101a.633.633 0 0 0 .329-.471.622.622 0 0 0-.19-.537c-.614-.627-4.5-.493-5.15-.37-.882.157-1.044.482-1.021.728a.68.68 0 0 0 .233.385c.12.099.271.157.428.164Zm1.566-32.872c-3.804.067-7.806.202-8.468.246-.255 0-.522.213-.556 2.543 0 2.789.498 11.625 1.658 11.704 2.32.168 14.315.213 15.858.101.243 0 .44 0 0-5.824-.244-3.002-.789-8.456-.789-8.456-.047-.224-.07-.426-7.703-.314Zm6.833.986c.278 4.177.429 8.456.893 12.656h-14.755c-.453-4.044-.754-8.21-1.079-12.488l14.941-.168Zm-12.563-7.292c4.71 0 12.586-.616 12.656-.649.742-.37 0-10.483-.244-14.807 0-.772-4.095-.784-7.494-.66-1.484 0-8.862.38-8.839 1.4.395 14.996.302 14.268.592 14.425 1.085.274 2.21.372 3.329.291Zm-2.448-1.12c-.266-4.412-.359-9.094-.545-13.44 4.817-.413 9.654-.57 14.489-.47 0 1.534.313 11.738.51 13.44-1.717.112-12.656.19-14.419.482l-.035-.012Z"
    />
    <Path
      fill="#000"
      d="M285.04 124.622c-3.039-79.822-1.763-79.15-2.32-79.62-.789-.717-6.879-.247-8.375-.168l-.626-12.242a.498.498 0 0 0 .032-.232.49.49 0 0 0-.262-.38.525.525 0 0 0-.234-.06c-24.36-.291-49.428 1.266-74.565 2.912-6.775.46-13.816.862-20.706 1.568a.455.455 0 0 0-.363.102.43.43 0 0 0-.148.335c1.276 29.904 4.988 78.243 11.403 131.768.07.616 5.359.078 10.115-.224.063 1.317.308 2.621.731 3.875.696.851 86.745-4.301 86.641-7.84-.372-13.294-.87-26.757-1.323-39.794Zm-6.519 34.922c-30.508 4.48-57.942 5.734-88.578 8.288-6.066-50.747-8.56-85.557-11.6-130.648 9.42-.538 44.254-3.629 94.575-4.267 1.253 32.558 5.916 123.043 5.568 126.627h.035Zm-145.615-77c-.789 0-.777 1.478-.406 2.038.043.082.11.15.192.196a.503.503 0 0 0 .272.062c.708-.078.673-2.218-.058-2.296Zm-4.141 6.474c.499.123 1.844.201 2.158-.247.44-.627-.754-6.317-.905-6.72a.377.377 0 0 0-.17-.194.397.397 0 0 0-.261-.043.385.385 0 0 0-.226.13.363.363 0 0 0-.086.242c0 1.019.476 4.48.662 5.924l-1.16.068a.458.458 0 0 0-.29.416.452.452 0 0 0 .074.252c.049.075.12.135.204.172Zm3.155-8.568c.343-.091.705-.1 1.052-.026.348.074.672.23.943.451.453.392 1.323-.358.082-1.12-.894-.582-2.982-.784-2.761.247a.595.595 0 0 0 .252.351.633.633 0 0 0 .432.097Z"
    />
    <Path
      fill="#000"
      d="M165.931 121.162c-7.459-7.101-20.88-15.445-32.944-17.103.2-.666.2-1.372 0-2.038a21.371 21.371 0 0 0 2.552-2.43c1.659-1.882 1.624-3.719-.742-2.79 2.32-4.95 2.32-15.68 1.485-21.705 3.886 2.34 10.44.09 9.639-4.48 5.278 1.534 8.712-8.59 2.007-10.416.94-7.66-9.222-8.77-12.331-4.3-1.751-4.94-9.802-2.342-9.222 1.534-3.631-3.764-11.472-2.453-12.563 2.24-3.282-2.879-8.7-1.658-8.224 2.587-5.197-2.33-7.946 3.673-3.909 5.6-2.587 1.344-2.506 6.877 1.461 6.877 0 3.696 2.32 12.163 8.062 16.8.615 5.185-.487 7.84-2.401 12.644-18.931 2.778-33.303 17.036-39.753 34.72-7.354 20.16-3.863 39.2 17.934 43.21a38.68 38.68 0 0 1-.975 7.997.402.402 0 0 0 .075.28.427.427 0 0 0 .247.165c.1.025.206.013.298-.031a.42.42 0 0 0 .204-.213 30.259 30.259 0 0 0 1.253-8.019 27.275 27.275 0 0 0 15.394-2.268c4.78-2.231 8.753-5.8 11.402-10.242a97.89 97.89 0 0 0 10.266 3.136c10.95 2.99 25.23 5.958 38.755 2.419-.267 6.261-.638 11.278-1.218 16.262 0 .493.708.639.789.146.452-2.621 1.578-14.123 1.508-16.71 8.607-2.554 14.361-8.322 15.776-15.815 2.471-12.701-3.097-26.958-14.825-38.057Zm-49.265-48.239c.302 3.27 0 5.6-1.032 7.112-.383.549-.963 1.12-1.462 1.12-.383-.403-2.888-2.912-5.255-1.445-1.543.975-1.612 2.868-.151 5.332a14.3 14.3 0 0 1 2.204 4.928c-4.442-4.66-5.8-9.028-6.82-15.288a5.506 5.506 0 0 0 3.062-1.636c2.03 2.912 6.995 2.33 9.454-.123Zm-7.192 7.527c1.566-.93 3.016.19 4.338 1.31.778.66 2.054-.269 2.657-1.12 1.577-2.106 1.438-5.6 1.229-7.347a6.174 6.174 0 0 0 4.176 1.613 6.17 6.17 0 0 0 4.176-1.613c.232 3.225 7.239 3.965 9.083 1.288.847 5.6 1.253 17.707-1.554 22.78-2.32.986-7.598 3.237-10.22 2.24-2.25-.862-3.387-4.177-6.009-5.6-1.763-.94-3.271.124-2.041 2.028 3.109 4.771 2.83 6.585.371 11.491a16.953 16.953 0 0 1-5.928-2.878c2.552-3.528 3.248-9.823 2.61-14.012-.568-3.73-1.16-3.505-2.691-6.26-.707-1.132-1.334-3.226-.197-3.92Zm19.569 22.59a.411.411 0 0 0-.207.204.388.388 0 0 0-.014.286.402.402 0 0 0 .185.223c.088.05.191.067.291.049a6.98 6.98 0 0 0 2.761-1.12 4.72 4.72 0 0 1-.812 2.956c-.209.28.163 1.12.917.079-.058 3.091-1.694 6.91-4.838 8.411a16 16 0 0 1-5.955-2.332 15.407 15.407 0 0 1-4.485-4.444c3.48-5.757.418-10.08-.603-11.872-.568-1.03-.278-1.187.65-.605 2.192 1.344 4.118 5.096 6.241 5.6 4.002.93 8.932-1.4 11.344-2.441 1.253-.55 1.984-.919.476.907-2.018 2.408-3.167 2.912-5.951 4.099Zm-49.091 47.802a.4.4 0 0 0-.018.289c.03.095.094.177.182.23a.443.443 0 0 0 .555-.083c10.173-15.478 27.005-26.219 35.67-42.784 1.346 2.89 7.099 6.608 10.649 6.608 0 2.789-.29 6.104-.592 9.285-3.48-.773-12.887-3.617-14.581-7.336-.197-.459-.963-.145-.777.314 1.589 4.155 11.403 7.493 15.254 8.198a132.406 132.406 0 0 1-4.814 24.73c-1.752 6.048-4.002 13.361-7.25 18.771-2.589 4.448-6.551 8.004-11.334 10.175a26.217 26.217 0 0 1-15.346 1.932c-21.414-3.629-24.638-22.277-17.365-41.977 6.797-18.458 21.68-31.45 38.848-33.914a26.603 26.603 0 0 0 6.067 3.226c-8.7 16.206-25.288 26.846-35.148 42.336Zm42.526-.079a114.916 114.916 0 0 1 35.449-8.187c3.48-.224 6.96-.213 10.44-.213.511 0 .522-.806 0-.806-2.366-.159-4.74-.2-7.111-.123-.568-4.48-8.932-17.551-11.774-21.168a.416.416 0 0 0-.267-.11.422.422 0 0 0-.277.086.395.395 0 0 0-.105.516c5.695 7.706 10.301 17.517 11.217 20.72-10.196.37-25.926 2.7-37.248 8.053 1.068-3.774 5.197-19.342 5.29-34.72 3.19-1.377 5.464-6.361 5.197-9.71 12.027 2.644 23.058 8.46 31.865 16.8 10.336 9.777 16.669 22.4 14.72 36.12-1.032 7.84-6.797 13.91-15.404 16.117-14.837 3.92-30.102.515-44.753-3.876a40.14 40.14 0 0 0-4.327-1.142 100.205 100.205 0 0 0 7.088-18.357Z"
    />
    <Path
      fill="#000"
      d="M121.909 78.658c.3-.428.7-.782 1.167-1.033.468-.25.99-.392 1.525-.412.846 0 .8-1.232 0-1.12a4.66 4.66 0 0 0-1.94.646 4.476 4.476 0 0 0-1.448 1.403c-.301.46.372.964.696.516Zm2.738 3.102c-.476.37-.441 2.24.278 2.24a.742.742 0 0 0 .437-.198.695.695 0 0 0 .213-.418c.267-.974-.418-1.971-.928-1.624Zm-1.021 9.251a.437.437 0 0 0-.141-.226.46.46 0 0 0-.517-.055.446.446 0 0 0-.189.192c-.116.156-.336.638.151 1.612a3.079 3.079 0 0 0 1.605 1.472c.703.285 1.49.311 2.212.074a.43.43 0 0 0 .225-.199.404.404 0 0 0-.148-.532.442.442 0 0 0-.298-.064c-1.647.313-2.598-.695-2.9-2.274Z"
    />
    <Path stroke="#000" strokeWidth={0.5} d="M0 191.75h306" />
  </Svg>
)

const Wave = () => (
  <View style={styles.waveContainer} pointerEvents="none">
    <Svg width={width} height={212} fill="none" >
      <Path
        fill="#C9C2B5"
        fillRule="evenodd"
        d="m0 170.325 10.662-14.496c11.846-14.496 33.169-43.487 55.676-47.111 21.324-1.812 43.831 18.12 65.154 21.744 22.508 3.623 45.016-10.872 66.339-18.12 22.507-5.436 43.831-5.436 66.338 3.624 21.323 10.872 43.831 32.615 66.339 32.615 21.323 0 43.83-21.743 65.154-48.923 22.507-28.991 43.83-63.419 55.676-81.538L462 0v212H0v-41.675Z"
        clipRule="evenodd"
        opacity={0.5}
      />
    </Svg>
  </View>
);

export default function SignUp({navigation}) {
  const[username,setUsername]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[retypePassword,setRetypePassword]=useState("");
  const[showPassword,setShowPassword]=useState(false);
  const[showRetypePassword,setShowRetypePassword]=useState(false);
  const[errors,setErrors]=useState({});

  const validateCredentials = () =>{
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const validations = [
      {condition : !email.trim(), field: 'email', message: 'Please enter an email'},
      {condition : !username.trim(), field: 'username', message:'Please enter a username'},
      {condition : !email.includes('@'), field: 'email', message:'Please enter a valid email'},
      {condition : !password, field: 'password', message: 'Please enter a password'},
      {condition : password.length<10, field: 'password', message:'Password must be at least 10 characters long'},
      {condition : !hasNumber.test(password), field: 'password', message: 'Password must contain at least 1 number'},
      {condition: !hasSpecialChar.test(password), field: 'password', message: 'Password must contain at least 1 special character'},
      {condition: password!==retypePassword, field: 'retypePassword', message:'Password does not match'},
    ];
    
    let currentErrors = {};
    let isValid = true;

    for (const v of validations){
      if(v.condition){
       if(!currentErrors[v.field]){
        currentErrors[v.field] = v.message;
       }
       isValid = false;
      }
    }
    
    if(!isValid) {
        setErrors(currentErrors);
        return false;
    }
    setErrors({});
    return true;
  };

  const handleSignUp = async () =>{
    if(!validateCredentials()){
      return;
    }
    try{
      const existingUsersJson = await AsyncStorage.getItem('users');
      const existingUsers = existingUsersJson ? JSON.parse(existingUsersJson):[];
      const userExists = existingUsers.find(
        user => user.username === username || user.email === email
      );
      if(userExists){
        Alert.alert('Username or email already exists','Please try another one');
        return;
      }
      const newUser = {
        id:email.trim(),
        username:username.trim(),
        email:email.trim(),
        password:password,
        role:"User",
        createdAt:new Date().toString(),
      };
      existingUsers.push(newUser);
      
      await AsyncStorage.setItem('users', JSON.stringify(existingUsers));
      Alert.alert(
        'Registration success', 'You can now log in using your credentials',
        [
          {
            text:'Ok',
            onPress:()=>{
              navigation.navigate('Welcomepage'),
              setUsername(""),
              setEmail(""),
              setPassword(""),
              setRetypePassword("");
            },
          },
        ]
      );
      console.log('User registered',newUser);
    }catch (e){
      console.log('User registration failed',e)
      Alert.alert('Failed to register', 'Please try again');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backButton} onPress={()=>navigation.navigate('Welcomepage')}>
            <View style={{marginTop:6}}>
              <BackArrowIcon/>
            </View>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity> 
          <View style={styles.illustration}>
            <Illustration/>
          </View>  
          <View style={styles.mainContent}>
            <Text style={styles.title}>Sign Up</Text>
            
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <TextInput
                placeholder='Email'
                style={styles.innerInput}
                onChangeText={(text) => {
                    setEmail(text);
                    setErrors(prev => ({...prev, email: null}));
                }}
                autoCorrect={false}
                placeholderTextColor={errors.email ? "#DA7676" : "#635C5C"}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <View style={[styles.inputContainer, errors.username && styles.inputError]}>
              <TextInput
                placeholder='Username'
                style={styles.innerInput}
                onChangeText={(text) => {
                    setUsername(text);
                    setErrors(prev => ({...prev, username: null}));
                }}
                autoCorrect={false}
                placeholderTextColor={errors.username ? "#DA7676" : "#635C5C"}
              />
            </View>
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
              <TextInput
                placeholder='Password'
                style={styles.passwordInput}
                onChangeText={(text) => {
                    setPassword(text);
                    setErrors(prev => ({...prev, password: null}));
                }}
                autoCorrect={false} 
                secureTextEntry={!showPassword}
                placeholderTextColor={errors.password ? "#DA7676" : "#635C5C"}
              />
              <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}>
                {showPassword ?<EyeClosedIcon/> : <EyeIcon/>}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            
            <View style={[styles.passwordContainer, errors.retypePassword && styles.inputError]}>
              <TextInput
                placeholder='Retype Password'
                style={styles.passwordInput}
                onChangeText={(text) => {
                    setRetypePassword(text);
                    setErrors(prev => ({...prev, retypePassword: null}));
                }}
                autoCorrect={false} 
                secureTextEntry={!showRetypePassword}
                placeholderTextColor={errors.retypePassword ? "#DA7676" : "#635C5C"}
              />
              <TouchableOpacity onPress={()=>setShowRetypePassword(!showRetypePassword)}>
                {showRetypePassword ?<EyeClosedIcon/> : <EyeIcon/>}
              </TouchableOpacity>
            </View>
            {errors.retypePassword && <Text style={styles.errorText}>{errors.retypePassword}</Text>}

            <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>   
        </ScrollView>
      </KeyboardAvoidingView>
      <Wave/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#E7E6E1",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  backButton:{
    flexDirection:"row",
    alignItems:"center",
    gap:5,
    alignSelf:"flex-start",
    paddingVertical:10,
  },
  backText:{
    fontSize:15,
    lineHeight:20,
  },
  illustration:{
    marginHorizontal:24,
  },
  mainContent:{
    gap:20,
    marginTop:25,
    marginHorizontal:13,
  },
  title:{
    fontSize:22,
    color:"#000",
    fontWeight:"bold",
  },
  inputContainer:{
    height: 60,
    borderWidth: 1,
    borderColor: "#887E7E",
    borderRadius: 5,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  innerInput: {
    height: '100%',
    fontSize: 16,
    color: "#000",
  },
  passwordContainer:{
    flexDirection:"row",
    alignItems:"center",
    height:60,
    borderWidth:1,
    borderColor:"#887E7E",
    borderRadius:5,
    paddingHorizontal:16
  },
  passwordInput:{
    flex:1,
    height:"100%",
    fontSize:16,
    color: "#000"
  },
  signupButton:{
    paddingVertical:20,
    paddingHorizontal:50,
    marginTop:15,
    backgroundColor:"#F5F5F5",
    alignItems:"center",
    alignSelf:"center",
    shadowColor: "#000",
    shadowOffset: {width: 0,height: 4, },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    borderRadius:10,
  },
  signupText:{
    fontSize:18,
    fontWeight:"bold",
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    width: width, 
    zIndex: -1,
  },
  inputError:{
    borderColor: "#DA7676",
    backgroundColor: "#da767626", 
    color: "#DA7676",
  },
  errorText:{
    color: "#DA7676",
    fontSize: 13,
    marginTop: 5,
    marginLeft: 5,
    fontWeight: '500',
  }
})