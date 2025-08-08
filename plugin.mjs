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

    api.onTokenContextMenu(({ token, menu }) => {
      menu.addItem("Alternar Camada", () => switchLayer(token));
    });

    api.onTokenEdit(({ token, form }) => {
      const layers = token.metadata?.layers?.join(",") ?? "";

      // Cria um container para o input
      const container = document.createElement("div");
      container.style.marginTop = "0.5em";

      const label = document.createElement("label");
      label.textContent = "Camadas (URLs separadas por vírgula):";
      label.htmlFor = "layerInput";

      const input = document.createElement("input");
      input.type = "text";
      input.id = "layerInput";
      input.style.width = "100%";
      input.value = layers;

      container.appendChild(label);
      container.appendChild(input);
      form.addCustomElement(container);

      form.onSubmit(() => {
        const newLayers = input.value
          .split(",")
          .map(x => x.trim())
          .filter(Boolean);
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
