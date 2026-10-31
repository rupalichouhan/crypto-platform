package com.zosh.service;

import com.zosh.model.Asset;
import com.zosh.model.Coin;
import com.zosh.model.User;

import java.math.BigDecimal;
import java.util.List;

public interface AssetService {

    Asset createAsset(User user, Coin coin, BigDecimal quantity, BigDecimal buyPrice);

    Asset createAsset(User user, Coin coin, double quantity);

    Asset getAssetById(Long assetId) throws Exception;

    Asset getAssetByUserIdAndId(Long userId, Long assetId);

    List<Asset> getUsersAssets(Long userId);

    Asset updateAsset(Long assetId, double quantity) throws Exception;

    Asset updateAsset(Long assetId, BigDecimal quantityDelta, BigDecimal newPrice, boolean isBuy) throws Exception;

    Asset findAssetByUserIdAndCoinId(Long userId, String coinId);

    void deleteAsset(Long assetId);
}
