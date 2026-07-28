import React, { useEffect, useRef } from 'react';
import { COLORS, MAP_CONFIG, LOCAL_TYPES } from '../../constants';

// Mapa com marcadores de catadores/centros
const CollectorMap = ({ collectors = [], selected, onSelectCollector, origin = null }) => {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);
  const origemMarkerRef = useRef(null);

  // Inicializa o mapa
  useEffect(() => {
    if (leafletRef.current) return;

    // Aguarda Leaflet estar disponível (carregado via CDN no index.html)
    const tryInit = () => {
      if (!window.L) {
        setTimeout(tryInit, 200);
        return;
      }

      const L = window.L;
      const map = L.map(mapRef.current).setView(
        [MAP_CONFIG.defaultCenter.lat, MAP_CONFIG.defaultCenter.lng],
        MAP_CONFIG.defaultZoom
      );

      L.tileLayer(MAP_CONFIG.tileUrl, {
        attribution: MAP_CONFIG.attribution,
      }).addTo(map);

      leafletRef.current = map;
      setTimeout(() => map.invalidateSize(), 0);
    };

    tryInit();

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, []);

  // Atualiza marcadores quando a lista mudar
  useEffect(() => {
    const L = window.L;
    const map = leafletRef.current;
    if (!map || !L) return;

    map.invalidateSize();

    // Remove marcadores antigos
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    collectors.forEach((collector) => {
      // Sem coordenada válida não há onde desenhar o marcador — pula em vez
      // de deixar o Leaflet quebrar com lat/lng inválidos (o que também
      // interrompia a criação dos marcadores seguintes no loop).
      if (typeof collector.lat !== 'number' || typeof collector.lng !== 'number') {
        return;
      }

      const isCenter = collector.tipo === LOCAL_TYPES.CENTER;
      const isAproximado = Boolean(collector.localizacaoAproximada);
      const color = isCenter ? COLORS.info : COLORS.orange;
      const isSelected = selected?.id === collector.id;

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            width: ${isSelected ? 44 : 36}px;
            height: ${isSelected ? 44 : 36}px;
            background: ${isSelected ? COLORS.markerSelected : color};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid var(--color-keyword-white);
            box-shadow: 0 2px 8px var(--color-rgba-0-0-0-0p3);
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
          ">
            <span style="transform: rotate(45deg); font-size: ${isSelected ? 18 : 14}px;">
              ${isCenter ? '🏭' : '👤'}
            </span>
          </div>
        `,
        iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
        iconAnchor: [isSelected ? 22 : 18, isSelected ? 44 : 36],
      });

      // Catadores autônomos usam localização aproximada (privacidade); um
      // círculo tracejado ao redor do marcador deixa isso claro pra quem
      // está olhando o mapa (público-alvo inclui pessoas mais velhas, então
      // preferimos um sinal visual explícito a uma legenda escondida).
      if (isAproximado) {
        const circulo = L.circle([collector.lat, collector.lng], {
          radius: 150,
          color: COLORS.orange,
          weight: 1.5,
          dashArray: '4 4',
          fillColor: COLORS.orange,
          fillOpacity: 0.08,
        }).addTo(map);
        markersRef.current.push(circulo);
      }

      const marker = L.marker([collector.lat, collector.lng], { icon })
        .addTo(map)
        .on('click', () => onSelectCollector?.(collector));

      markersRef.current.push(marker);
    });

    // Marcador da origem da busca (endereço cadastrado ou "seu local")
    if (origemMarkerRef.current) {
      origemMarkerRef.current.remove();
      origemMarkerRef.current = null;
    }

    if (origin && typeof origin.lat === 'number' && typeof origin.lng === 'number') {
      const iconeOrigem = L.divIcon({
        className: '',
        html: `
          <div style="
            width: 18px; height: 18px; border-radius: 50%;
            background: ${COLORS.info};
            border: 3px solid var(--color-keyword-white);
            box-shadow: 0 0 0 4px var(--color-rgba-33-150-243-0p25), 0 2px 6px var(--color-rgba-0-0-0-0p3);
          "></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      origemMarkerRef.current = L.marker([origin.lat, origin.lng], {
        icon: iconeOrigem,
        zIndexOffset: -100,
      }).addTo(map);
    }
  }, [collectors, selected, onSelectCollector, origin]);

  // Ajusta o enquadramento para que todos os marcadores (e a origem) fiquem
  // visíveis, em vez de manter o mapa sempre centralizado no ponto padrão
  // (São Paulo) independente de onde os dados realmente estão. Roda só
  // quando a lista de coletores ou a origem mudam — não a cada seleção.
  useEffect(() => {
    const L = window.L;
    const map = leafletRef.current;
    if (!map || !L) return;

    const pontos = [
      ...collectors
        .filter((c) => typeof c.lat === 'number' && typeof c.lng === 'number')
        .map((c) => [c.lat, c.lng]),
      ...(origin ? [[origin.lat, origin.lng]] : []),
    ];

    if (pontos.length > 0) {
      const bounds = L.latLngBounds(pontos);
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: MAP_CONFIG.defaultZoom });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(collectors.map((c) => [c.id, c.lat, c.lng])), origin?.lat, origin?.lng]);

  useEffect(() => {
    const map = leafletRef.current;
    if (!map) return;

    const resizeMap = () => map.invalidateSize();
    window.addEventListener('resize', resizeMap);
    return () => window.removeEventListener('resize', resizeMap);
  }, []);

  // Centraliza no selecionado
  useEffect(() => {
    const map = leafletRef.current;
    if (!map || !selected) return;
    map.flyTo([selected.lat, selected.lng], 15, { animate: true, duration: 0.8 });
  }, [selected]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100%',
        borderRadius: '0',
        zIndex: 1,
      }}
    />
  );
};

export default CollectorMap;