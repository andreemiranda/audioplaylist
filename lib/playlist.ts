export interface Track {
  id: number;
  title: string;
  part?: string;
  mp3: string;
  oga: string;
  remoteMp3: string;
  remoteOga: string;
}

export const PLAYLIST: Track[] = [
  { id: 1, title: "Início", mp3: "/mp3/1.mp3", oga: "/ogg/1.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/1.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/1.ogg" },
  { id: 2, title: "Prefácio, Sumário", mp3: "/mp3/2.mp3", oga: "/ogg/2.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/2.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/2.ogg" },
  { id: 3, title: "Introdução (Parte 1)", part: "Parte 1", mp3: "/mp3/3.mp3", oga: "/ogg/3.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/3.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/3.ogg" },
  { id: 4, title: "Introdução (Parte 2)", part: "Parte 2", mp3: "/mp3/4.mp3", oga: "/ogg/4.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/4.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/4.ogg" },
  { id: 5, title: "Capítulo 1", mp3: "/mp3/5.mp3", oga: "/ogg/5.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/5.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/5.ogg" },
  { id: 6, title: "Capítulo 2", mp3: "/mp3/6.mp3", oga: "/ogg/6.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/6.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/6.ogg" },
  { id: 7, title: "Capítulo 3", mp3: "/mp3/7.mp3", oga: "/ogg/7.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/7.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/7.ogg" },
  { id: 8, title: "Sub Capítulo 3.1 (Parte 1)", part: "Parte 1", mp3: "/mp3/8.mp3", oga: "/ogg/8.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/8.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/8.ogg" },
  { id: 9, title: "Sub Capítulo 3.1 (Parte 2)", part: "Parte 2", mp3: "/mp3/9.mp3", oga: "/ogg/9.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/9.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/9.ogg" },
  { id: 10, title: "Sub Capítulo 3.1 (Parte 3)", part: "Parte 3", mp3: "/mp3/10.mp3", oga: "/ogg/10.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/10.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/10.ogg" },
  { id: 11, title: "Sub Capítulo 3.1 (Parte 4)", part: "Parte 4", mp3: "/mp3/11.mp3", oga: "/ogg/11.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/11.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/11.ogg" },
  { id: 12, title: "Sub Capítulo 3.1 (Parte 5)", part: "Parte 5", mp3: "/mp3/12.mp3", oga: "/ogg/12.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/12.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/12.ogg" },
  { id: 13, title: "Sub Capítulo 3.1 (Parte 6)", part: "Parte 6", mp3: "/mp3/13.mp3", oga: "/ogg/13.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/13.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/13.ogg" },
  { id: 14, title: "Sub Capítulo 3.1 (Parte 7)", part: "Parte 7", mp3: "/mp3/14.mp3", oga: "/ogg/14.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/14.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/14.ogg" },
  { id: 15, title: "Sub Capítulo 3.1 (Parte 8)", part: "Parte 8", mp3: "/mp3/15.mp3", oga: "/ogg/15.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/15.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/15.ogg" },
  { id: 16, title: "Sub Capítulo 3.2", mp3: "/mp3/16.mp3", oga: "/ogg/16.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/16.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/16.ogg" },
  { id: 17, title: "Sub Capítulo 3.3 (Parte 1)", part: "Parte 1", mp3: "/mp3/17.mp3", oga: "/ogg/17.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/17.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/17.ogg" },
  { id: 18, title: "Sub Capítulo 3.3 (Parte 2)", part: "Parte 2", mp3: "/mp3/18.mp3", oga: "/ogg/18.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/18.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/18.ogg" },
  { id: 19, title: "Sub Capítulo 3.4 (Parte 1)", part: "Parte 1", mp3: "/mp3/19.mp3", oga: "/ogg/19.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/19.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/19.ogg" },
  { id: 20, title: "Sub Capítulo 3.4 (Parte 2)", part: "Parte 2", mp3: "/mp3/20.mp3", oga: "/ogg/20.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/20.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/20.ogg" },
  { id: 21, title: "Sub Capítulo 3.5", mp3: "/mp3/21.mp3", oga: "/ogg/21.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/21.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/21.ogg" },
  { id: 22, title: "Capítulo 4 (Parte 1)", part: "Parte 1", mp3: "/mp3/22.mp3", oga: "/ogg/22.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/22.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/22.ogg" },
  { id: 23, title: "Capítulo 4 (Parte 2)", part: "Parte 2", mp3: "/mp3/23.mp3", oga: "/ogg/23.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/23.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/23.ogg" },
  { id: 24, title: "Capítulo 4 (Parte 3)", part: "Parte 3", mp3: "/mp3/24.mp3", oga: "/ogg/24.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/24.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/24.ogg" },
  { id: 25, title: "Capítulo 4 (Parte 4)", part: "Parte 4", mp3: "/mp3/25.mp3", oga: "/ogg/25.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/25.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/25.ogg" },
  { id: 26, title: "Capítulo 4 (Parte 5)", part: "Parte 5", mp3: "/mp3/26.mp3", oga: "/ogg/26.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/26.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/26.ogg" },
  { id: 27, title: "Capítulo 4 (Parte 6)", part: "Parte 6", mp3: "/mp3/27.mp3", oga: "/ogg/27.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/27.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/27.ogg" },
  { id: 28, title: "Capítulo 4 (Parte 7)", part: "Parte 7", mp3: "/mp3/28.mp3", oga: "/ogg/28.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/28.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/28.ogg" },
  { id: 29, title: "Capítulo 4 (Parte 8)", part: "Parte 8", mp3: "/mp3/29.mp3", oga: "/ogg/29.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/29.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/29.ogg" },
  { id: 30, title: "Capítulo 4 (Parte 9)", part: "Parte 9", mp3: "/mp3/30.mp3", oga: "/ogg/30.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/30.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/30.ogg" },
  { id: 31, title: "Capítulo 4 (Parte 10)", part: "Parte 10", mp3: "/mp3/31.mp3", oga: "/ogg/31.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/31.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/31.ogg" },
  { id: 32, title: "Capítulo 4 (Parte 11)", part: "Parte 11", mp3: "/mp3/32.mp3", oga: "/ogg/32.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/32.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/32.ogg" },
  { id: 33, title: "Capítulo 4 (Parte 12)", part: "Parte 12", mp3: "/mp3/33.mp3", oga: "/ogg/33.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/33.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/33.ogg" },
  { id: 34, title: "Capítulo 4 (Parte 13)", part: "Parte 13", mp3: "/mp3/34.mp3", oga: "/ogg/34.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/34.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/34.ogg" },
  { id: 35, title: "Capítulo 4 (Parte 14)", part: "Parte 14", mp3: "/mp3/35.mp3", oga: "/ogg/35.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/35.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/35.ogg" },
  { id: 36, title: "Capítulo 4 (Parte 15)", part: "Parte 15", mp3: "/mp3/36.mp3", oga: "/ogg/36.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/36.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/36.ogg" },
  { id: 37, title: "Capítulo 4 (Parte 16)", part: "Parte 16", mp3: "/mp3/37.mp3", oga: "/ogg/37.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/37.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/37.ogg" },
  { id: 38, title: "Capítulo 4 (Parte 17)", part: "Parte 17", mp3: "/mp3/38.mp3", oga: "/ogg/38.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/38.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/38.ogg" },
  { id: 39, title: "Final", mp3: "/mp3/39.mp3", oga: "/ogg/39.ogg", remoteMp3: "https://andreemiranda.github.io/audioplaylist/mp3/39.mp3", remoteOga: "https://andreemiranda.github.io/audioplaylist/ogg/39.ogg" },
];
