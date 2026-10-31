package com.zosh.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zosh.model.Asset;
import com.zosh.model.Coin;
import com.zosh.model.User;
import com.zosh.repository.AssetRepository;

@Service
public class AssetServiceImpl implements AssetService {
    
    @Autowired
    private AssetRepository assetRepository;

    @Override
    public Asset createAsset(User user, Coin coin, BigDecimal quantity, BigDecimal buyPrice) {
        Asset asset = new Asset();
        asset.setUser(user);
        asset.setCoin(coin);
        asset.setQuantity(quantity != null ? quantity.setScale(8, RoundingMode.HALF_EVEN) : BigDecimal.ZERO.setScale(8, RoundingMode.HALF_EVEN));
        asset.setBuyPrice(buyPrice != null ? buyPrice.setScale(2, RoundingMode.HALF_EVEN) : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_EVEN));
        return assetRepository.save(asset);
    }

    @Override
    public Asset createAsset(User user, Coin coin, double quantity) {
        BigDecimal qty = BigDecimal.valueOf(quantity).setScale(8, RoundingMode.HALF_EVEN);
        BigDecimal price = BigDecimal.valueOf(coin.getCurrentPrice()).setScale(2, RoundingMode.HALF_EVEN);
        return createAsset(user, coin, qty, price);
    }

    @Override
    public Asset getAssetById(Long assetId) throws Exception {
        return assetRepository.findById(assetId).orElseThrow(() -> new Exception("asset not found"));
    }

    @Override
    public Asset getAssetByUserIdAndId(Long userId, Long assetId) {
        return null;
    }

    @Override
    public List<Asset> getUsersAssets(Long userId) {
        return assetRepository.findByUserId(userId);
    }

    @Override
    public Asset updateAsset(Long assetId, double quantity) throws Exception {
        Asset oldAsset = getAssetById(assetId);
        if (quantity >= 0) {
            BigDecimal coinPrice = (oldAsset.getCoin() != null && oldAsset.getCoin().getCurrentPrice() != 0)
                    ? BigDecimal.valueOf(oldAsset.getCoin().getCurrentPrice())
                    : oldAsset.getBuyPrice();
            return updateAsset(assetId, BigDecimal.valueOf(quantity), coinPrice, true);
        } else {
            return updateAsset(assetId, BigDecimal.valueOf(Math.abs(quantity)), BigDecimal.ZERO, false);
        }
    }

    @Override
    public Asset updateAsset(Long assetId, BigDecimal quantityDelta, BigDecimal newPrice, boolean isBuy) throws Exception {
        Asset oldAsset = getAssetById(assetId);
        BigDecimal currentQty = oldAsset.getQuantity() != null ? oldAsset.getQuantity() : BigDecimal.ZERO.setScale(8, RoundingMode.HALF_EVEN);
        BigDecimal currentBuyPrice = oldAsset.getBuyPrice() != null ? oldAsset.getBuyPrice() : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal delta = (quantityDelta != null ? quantityDelta : BigDecimal.ZERO).abs().setScale(8, RoundingMode.HALF_EVEN);

        if (isBuy) {
            BigDecimal effectivePrice = (newPrice != null ? newPrice : currentBuyPrice).setScale(2, RoundingMode.HALF_EVEN);
            BigDecimal totalQty = currentQty.add(delta).setScale(8, RoundingMode.HALF_EVEN);

            if (totalQty.compareTo(BigDecimal.ZERO) > 0) {
                // Weighted average: ((currentQty * currentBuyPrice) + (delta * effectivePrice)) / totalQty
                BigDecimal totalCurrentCost = currentQty.multiply(currentBuyPrice);
                BigDecimal newTradeCost = delta.multiply(effectivePrice);
                BigDecimal combinedCost = totalCurrentCost.add(newTradeCost);
                BigDecimal weightedAvgPrice = combinedCost.divide(totalQty, 2, RoundingMode.HALF_EVEN);

                oldAsset.setBuyPrice(weightedAvgPrice);
            }
            oldAsset.setQuantity(totalQty);
        } else {
            // Sell order: decreases quantity; cost basis per unit remains unchanged
            BigDecimal remainingQty = currentQty.subtract(delta).setScale(8, RoundingMode.HALF_EVEN);
            if (remainingQty.compareTo(BigDecimal.ZERO) < 0) {
                remainingQty = BigDecimal.ZERO.setScale(8, RoundingMode.HALF_EVEN);
            }
            oldAsset.setQuantity(remainingQty);
        }

        return assetRepository.save(oldAsset);
    }

    @Override
    public Asset findAssetByUserIdAndCoinId(Long userId, String coinId) {
        return assetRepository.findByUserIdAndCoinId(userId, coinId);
    }

    @Override
    public void deleteAsset(Long assetId) {
        assetRepository.deleteById(assetId);
    }
}