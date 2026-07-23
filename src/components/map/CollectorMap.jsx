import React, { useEffect, useRef } from 'react';
import { COLORS, MAP_CONFIG, LOCAL_TYPES } from '../../constants';

// Mapa com marcadores de catadores/centros
const CollectorMap = ({ collectors = [], selected, onSelectCollector }) => {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);

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
      const isCenter = collector.tipo === LOCAL_TYPES.CENTER;
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

      const marker = L.marker([collector.lat, collector.lng], { icon })
        .addTo(map)
        .on('click', () => onSelectCollector?.(collector));

      markersRef.current.push(marker);
    });
  }, [collectors, selected, onSelectCollector]);

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