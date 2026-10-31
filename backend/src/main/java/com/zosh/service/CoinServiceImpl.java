package com.zosh.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.zosh.model.Coin;
import com.zosh.repository.CoinRepository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class CoinServiceImpl implements CoinService {

    @Autowired
    private CoinRepository coinRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    @Cacheable(value = "coinList", key = "#page")
    public List<Coin> getCoinList(int page) throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page=" + page;
        try {
            HttpEntity<String> entity = new HttpEntity<>("parameters", new HttpHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            List<Coin> list = objectMapper.readValue(response.getBody(), new TypeReference<List<Coin>>() {});
            if (list != null && !list.isEmpty()) {
                coinRepository.saveAll(list);
            }
            return list;
        } catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("CoinGecko 429 Rate Limit (getCoinList). Falling back to local database records.");
            return coinRepository.findAll(PageRequest.of(Math.max(0, page - 1), 10)).getContent();
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            List<Coin> fallback = coinRepository.findAll(PageRequest.of(Math.max(0, page - 1), 10)).getContent();
            if (!fallback.isEmpty()) return fallback;
            throw new Exception("Error fetching coin list: " + e.getMessage());
        } catch (Exception e) {
            List<Coin> fallback = coinRepository.findAll(PageRequest.of(Math.max(0, page - 1), 10)).getContent();
            if (!fallback.isEmpty()) return fallback;
            throw e;
        }
    }

    @Override
    @Cacheable(value = "marketCharts", key = "#coinId + '-' + #days")
    public String getMarketChart(String coinId, int days) throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/" + coinId + "/market_chart?vs_currency=usd&days=" + days;
        try {
            HttpEntity<String> entity = new HttpEntity<>("parameters", new HttpHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return response.getBody();
        } catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("CoinGecko 429 Rate Limit (getMarketChart for " + coinId + "). Returning safe fallback chart series.");
            return generateFallbackChart(coinId, days);
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            return generateFallbackChart(coinId, days);
        }
    }

    private String generateFallbackChart(String coinId, int days) {
        Optional<Coin> coinOpt = coinRepository.findById(coinId);
        double basePrice = coinOpt.map(Coin::getCurrentPrice).orElse(50000.0);
        long now = System.currentTimeMillis();
        long step = (long) days * 86400000L / 24L;

        StringBuilder sb = new StringBuilder("{\"prices\":[");
        for (int i = 24; i >= 0; i--) {
            long t = now - (i * step);
            double noise = (Math.sin(i) * 0.02 + 1.0) * basePrice;
            sb.append("[").append(t).append(",").append(String.format(java.util.Locale.US, "%.2f", noise)).append("]");
            if (i > 0) sb.append(",");
        }
        sb.append("],\"market_caps\":[],\"total_volumes\":[]}");
        return sb.toString();
    }

    @Override
    @Cacheable(value = "coinDetails", key = "#coinId")
    public String getCoinDetails(String coinId) throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/" + coinId;
        try {
            HttpEntity<String> entity = new HttpEntity<>("parameters", new HttpHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            Coin coin = new Coin();
            coin.setId(rootNode.get("id").asText());
            coin.setName(rootNode.get("name").asText());
            coin.setSymbol(rootNode.get("symbol").asText());
            if (rootNode.has("image") && rootNode.get("image").has("large")) {
                coin.setImage(rootNode.get("image").get("large").asText());
            }

            JsonNode marketData = rootNode.get("market_data");
            if (marketData != null) {
                if (marketData.has("current_price") && marketData.get("current_price").has("usd")) {
                    coin.setCurrentPrice(marketData.get("current_price").get("usd").asDouble());
                }
                if (marketData.has("market_cap") && marketData.get("market_cap").has("usd")) {
                    coin.setMarketCap(marketData.get("market_cap").get("usd").asLong());
                }
                if (marketData.has("market_cap_rank") && !marketData.get("market_cap_rank").isNull()) {
                    coin.setMarketCapRank(marketData.get("market_cap_rank").asInt());
                }
                if (marketData.has("total_volume") && marketData.get("total_volume").has("usd")) {
                    coin.setTotalVolume(marketData.get("total_volume").get("usd").asLong());
                }
                if (marketData.has("high_24h") && marketData.get("high_24h").has("usd")) {
                    coin.setHigh24h(marketData.get("high_24h").get("usd").asDouble());
                }
                if (marketData.has("low_24h") && marketData.get("low_24h").has("usd")) {
                    coin.setLow24h(marketData.get("low_24h").get("usd").asDouble());
                }
                if (marketData.has("price_change_24h") && !marketData.get("price_change_24h").isNull()) {
                    coin.setPriceChange24h(marketData.get("price_change_24h").asDouble());
                }
                if (marketData.has("price_change_percentage_24h") && !marketData.get("price_change_percentage_24h").isNull()) {
                    coin.setPriceChangePercentage24h(marketData.get("price_change_percentage_24h").asDouble());
                }
                if (marketData.has("market_cap_change_24h") && !marketData.get("market_cap_change_24h").isNull()) {
                    coin.setMarketCapChange24h(marketData.get("market_cap_change_24h").asDouble());
                }
                if (marketData.has("market_cap_change_percentage_24h") && !marketData.get("market_cap_change_percentage_24h").isNull()) {
                    coin.setMarketCapChangePercentage24h(marketData.get("market_cap_change_percentage_24h").asDouble());
                }
                if (marketData.has("total_supply") && !marketData.get("total_supply").isNull()) {
                    coin.setTotalSupply(marketData.get("total_supply").asLong());
                }
            }

            coinRepository.save(coin);
            return response.getBody();
        } catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("CoinGecko 429 Rate Limit (getCoinDetails for " + coinId + "). Returning local entity fallback.");
            Optional<Coin> localCoin = coinRepository.findById(coinId);
            if (localCoin.isPresent()) {
                Coin c = localCoin.get();
                return String.format(java.util.Locale.US,
                    "{\"id\":\"%s\",\"name\":\"%s\",\"symbol\":\"%s\",\"image\":{\"large\":\"%s\"},"
                    + "\"market_data\":{\"current_price\":{\"usd\":%.2f},\"price_change_24h\":%.2f,"
                    + "\"price_change_percentage_24h\":%.2f,\"market_cap\":{\"usd\":%d},"
                    + "\"total_volume\":{\"usd\":%d},\"high_24h\":{\"usd\":%.2f},\"low_24h\":{\"usd\":%.2f}}}",
                    c.getId(), c.getName(), c.getSymbol(), c.getImage() != null ? c.getImage() : "",
                    c.getCurrentPrice(), c.getPriceChange24h(), c.getPriceChangePercentage24h(),
                    c.getMarketCap(), c.getTotalVolume(), c.getHigh24h(), c.getLow24h());
            }
            throw new Exception("Rate limit encountered and no local fallback available for " + coinId);
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            Optional<Coin> localCoin = coinRepository.findById(coinId);
            if (localCoin.isPresent()) {
                Coin c = localCoin.get();
                return String.format(java.util.Locale.US,
                    "{\"id\":\"%s\",\"name\":\"%s\",\"symbol\":\"%s\",\"image\":{\"large\":\"%s\"},"
                    + "\"market_data\":{\"current_price\":{\"usd\":%.2f},\"price_change_24h\":%.2f,"
                    + "\"price_change_percentage_24h\":%.2f,\"market_cap\":{\"usd\":%d},"
                    + "\"total_volume\":{\"usd\":%d},\"high_24h\":{\"usd\":%.2f},\"low_24h\":{\"usd\":%.2f}}}",
                    c.getId(), c.getName(), c.getSymbol(), c.getImage() != null ? c.getImage() : "",
                    c.getCurrentPrice(), c.getPriceChange24h(), c.getPriceChangePercentage24h(),
                    c.getMarketCap(), c.getTotalVolume(), c.getHigh24h(), c.getLow24h());
            }
            throw new Exception("Error fetching coin details: " + e.getMessage());
        }
    }

    @Override
    public Coin findById(String coinId) throws Exception {
        Optional<Coin> optionalCoin = coinRepository.findById(coinId);
        if (optionalCoin.isPresent()) {
            return optionalCoin.get();
        }
        try {
            getCoinDetails(coinId);
            return coinRepository.findById(coinId).orElseThrow(() -> new Exception("Coin not found: " + coinId));
        } catch (Exception e) {
            // Create minimal record if fallback needed
            Coin placeholder = new Coin();
            placeholder.setId(coinId);
            placeholder.setName(coinId.substring(0, 1).toUpperCase() + coinId.substring(1));
            placeholder.setSymbol(coinId.substring(0, Math.min(4, coinId.length())).toUpperCase());
            placeholder.setCurrentPrice(100.0);
            return coinRepository.save(placeholder);
        }
    }

    @Override
    @Cacheable(value = "coinSearch", key = "#keyword")
    public String searchCoin(String keyword) throws Exception {
        String url = "https://api.coingecko.com/api/v3/search?query=" + keyword;
        try {
            HttpEntity<String> entity = new HttpEntity<>("parameters", new HttpHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return response.getBody();
        } catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("CoinGecko 429 Rate Limit (searchCoin for " + keyword + "). Returning local search fallback.");
            return "{\"coins\":[]}";
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            return "{\"coins\":[]}";
        }
    }

    @Override
    @Cacheable(value = "top50Coins")
    public String getTop50CoinsByMarketCapRank() throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50&page=1";
        try {
            HttpEntity<String> entity = new HttpEntity<>("parameters", new HttpHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return response.getBody();
        } catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("CoinGecko 429 Rate Limit (top50). Falling back to local database records.");
            List<Coin> list = coinRepository.findAll(PageRequest.of(0, 50)).getContent();
            return objectMapper.writeValueAsString(list);
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            List<Coin> list = coinRepository.findAll(PageRequest.of(0, 50)).getContent();
            return objectMapper.writeValueAsString(list);
        }
    }

    @Override
    @Cacheable(value = "trendingCoins")
    public String getTrendingCoins() throws Exception {
        String url = "https://api.coingecko.com/api/v3/search/trending";
        try {
            HttpEntity<String> entity = new HttpEntity<>("parameters", new HttpHeaders());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return response.getBody();
        } catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("CoinGecko 429 Rate Limit (trending).");
            return "{\"coins\":[]}";
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            return "{\"coins\":[]}";
        }
    }
}
