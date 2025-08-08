// plugin.mjs
export default {
  id: "token-layer-switcher",
  name: "Token Layer Switcher",
  description: "Permite alternar camadas de tokens",
  icon: "🎭",
  tags: ["token", "layer", "switch"],
  onLoad: async (api) => {
    const switchLayer = (token) => {
      const layers = token.metadata?.layers || [];
      if (layers.length <= 1) return;

      const current = token.metadata?.currentLayerIndex ?? 0;
      const next = (current + 1) % layers.length;
      api.setToken(token.id, {
        image: layers[next],
        metadata: {
          ...token.metadata,
          currentLayerIndex: next,
        }
      });
    };

    api.onTokenContextMenu(async ({ token, menu }) => {
      menu.addItem("Alternar Camada", () => switchLayer(token));
    });

    api.onTokenEdit(async ({ token, form }) => {
      const input = form.addCustomHTML("Camadas (URLs separadas por vírgula)");
      const layers = token.metadata?.layers?.join(",") ?? "";
      input.innerHTML = `<input type="text" id="layerInput" value="${layers}" style="width: 100%" />`;

      form.onSubmit(() => {
        const newLayers = document.getElementById("layerInput").value.split(",").map(x => x.trim()).filter(Boolean);
        if (newLayers.length > 0) {
          api.setToken(token.id, {
            metadata: {
              ...token.metadata,
              layers: newLayers,
              currentLayerIndex: 0,
            }
          });
        }
      });
    });
  }
};
