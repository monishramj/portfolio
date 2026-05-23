import FilmStrip from './components/layout/FilmStrip';
import Frame from './components/layout/Frame';
import InterFrame from './components/layout/InterFrame';
import ModelViewer from './components/ModelViewer';

export default function App() {
  return (
    <FilmStrip>
      <Frame num="01" scratch="22%">
        <ModelViewer
          url="/grandmas_tv.glb"
          width="100%"
          height={400}
          defaultRotationX={170}
          defaultRotationY={30}
          defaultZoom={1}
          showScreenshotButton={false}
          environmentPreset="dawn"
          enableManualZoom={false}
          autoFrame
        />
      </Frame>
      <InterFrame left="FILM STRIP" center="02" right="MONISH RJ" />
      <Frame num="02">
      </Frame>
      <InterFrame left="FILM STRIP" center="03" right="MONISH RJ" />
      <Frame num="03" scratch="65%">
      </Frame>
    </FilmStrip>
  );
}
