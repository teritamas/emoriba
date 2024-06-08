<template>
  <div class="h-screen absolute top-0 left-0 flex justify-center text-center">
    <a-scene
      vr-mode-ui="enabled: false;"
      loading-screen="enabled: false;"
      renderer="logarithmicDepthBuffer: true;"
      arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
      embedded
      gesture-detector
    >
      <a-nft
        type="nft"
        url="https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/trex-image/trex"
        smooth="true"
        smoothCount="10"
        smoothTolerance=".01"
        smoothThreshold="5"
      >
        <a-entity
          gltf-model="https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf"
          scale="5 5 5"
          position="50 150 0"
        >
        </a-entity>
      </a-nft>
      <a-entity camera></a-entity>
    </a-scene>
  </div>
</template>
