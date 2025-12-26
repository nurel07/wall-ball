import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../services/api_service.dart';

class CollectionDetailScreen extends ConsumerWidget {
  final String collectionId;

  const CollectionDetailScreen({super.key, required this.collectionId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final collectionAsync = ref.watch(collectionDetailsProvider(collectionId));

    return Scaffold(
      body: collectionAsync.when(
        data: (collection) {
          final wallpapers = collection.wallpapers ?? [];

          return CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 200,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  title: Text(collection.name),
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                       CachedNetworkImage(
                         imageUrl: collection.coverImage, 
                         fit: BoxFit.cover,
                       ),
                       Container(
                         decoration: BoxDecoration(
                           gradient: LinearGradient(
                             begin: Alignment.topCenter,
                             end: Alignment.bottomCenter,
                             colors: [Colors.transparent, Colors.black87],
                           ),
                         ),
                       ),
                    ],
                  ),
                ),
              ),
              if (collection.description != null && collection.description!.isNotEmpty)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      collection.description!,
                      style: const TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                  ),
                ),
                
              SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 9 / 16,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final wallpaper = wallpapers[index];
                      return GestureDetector(
                        onTap: () => context.go('/collection/$collectionId/wallpaper', extra: wallpaper),
                        child: Hero(
                          tag: wallpaper.id,
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: CachedNetworkImage(
                              imageUrl: wallpaper.url,
                              fit: BoxFit.cover,
                              placeholder: (context, url) => Container(color: Colors.grey[900]),
                            ),
                          ),
                        ),
                      );
                    },
                    childCount: wallpapers.length,
                  ),
                ),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
}
