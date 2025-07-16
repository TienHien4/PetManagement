"use client"
import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import Footer from "../components/home/Footer"
import Header from "../components/home/Header"

const NewsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isVisible, setIsVisible] = useState({})
    const articlesPerPage = 6

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({
                            ...prev,
                            [entry.target.id]: true,
                        }))
                    }
                })
            },
            { threshold: 0.1 },
        )

        const elements = document.querySelectorAll(".animate-on-scroll")
        elements.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    const categories = [
        { id: "all", name: "Tất cả", icon: "bi-grid", color: "#667eea" },
        { id: "health", name: "Sức khỏe", icon: "bi-heart-pulse", color: "#f093fb" },
        { id: "nutrition", name: "Dinh dưỡng", icon: "bi-apple", color: "#4facfe" },
        { id: "training", name: "Huấn luyện", icon: "bi-trophy", color: "#43e97b" },
        { id: "grooming", name: "Chăm sóc", icon: "bi-scissors", color: "#fa709a" },
        { id: "tips", name: "Mẹo hay", icon: "bi-lightbulb", color: "#ffeaa7" },
    ]

    const articles = [
        {
            id: 1,
            title: "10 Dấu hiệu cho thấy thú cưng của bạn cần đi khám bác sĩ ngay lập tức",
            excerpt: "Việc nhận biết sớm các dấu hiệu bệnh tật ở thú cưng có thể cứu sống chúng. Hãy cùng tìm hiểu những dấu hiệu cảnh báo quan trọng...",
            category: "health",
            author: "Dr. Nguyễn Văn A",
            date: "2024-01-15",
            readTime: "5 phút đọc",
            image: "/placeholder.svg?height=300&width=400",
            featured: true,
            tags: ["sức khỏe", "khẩn cấp", "chẩn đoán"],
        },
        {
            id: 2,
            title: "Chế độ dinh dưỡng hoàn hảo cho chó con từ 2-6 tháng tuổi",
            excerpt: "Giai đoạn từ 2-6 tháng là thời kỳ phát triển quan trọng nhất của chó con. Chế độ dinh dưỡng đúng cách sẽ giúp chúng phát triển khỏe mạnh...",
            category: "nutrition",
            author: "Dr. Trần Thị B",
            date: "2024-01-12",
            readTime: "7 phút đọc",
            image: "/placeholder.svg?height=300&width=400",
            featured: false,
            tags: ["dinh dưỡng", "chó con", "phát triển"],
        },
        {
            id: 3,
            title: "Cách huấn luyện mèo sử dụng toilet như con người",
            excerpt: "Bạn có tin rằng mèo có thể học cách sử dụng toilet như con người? Với phương pháp đúng và kiên nhẫn, điều này hoàn toàn có thể...",
            category: "training",
            author: "Chuyên gia Lê Văn C",
            date: "2024-01-10",
            readTime: "6 phút đọc",
            image: "/placeholder.svg?height=300&width=400",
            featured: true,
            tags: ["huấn luyện", "mèo", "toilet"],
        },
        {
            id: 4,
            title: "Spa tại nhà: Cách tắm và chăm sóc lông cho thú cưng",
            excerpt: "Không cần đến spa đắt tiền, bạn hoàn toàn có thể tạo ra một buổi spa thư giãn cho thú cưng ngay tại nhà với những mẹo đơn giản...",
            category: "grooming",
            author: "Chuyên gia Phạm Thị D",
            date: "2024-01-08",
            readTime: "8 phút đọc",
            image: "/placeholder.svg?height=300&width=400",
            featured: false,
            tags: ["spa", "chăm sóc", "lông"],
        },
        {
            id: 5,
            title: "5 Mẹo giúp thú cưng không còn sợ pháo hoa trong dịp Tết",
            excerpt: "Tiếng pháo hoa trong dịp Tết thường khiến thú cưng hoảng sợ. Dưới đây là những mẹo hiệu quả giúp thú cưng bình tĩnh hơn...",
            category: "tips",
            author: "Chuyên gia Hoàng Văn E",
            date: "2024-01-05",
            readTime: "4 phút đọc",
            image: "/placeholder.svg?height=300&width=400",
            featured: false,
            tags: ["mẹo hay", "pháo hoa", "tết"],
        },
        {
            id: 6,
            title: "Vaccine cần thiết cho thú cưng theo từng độ tuổi",
            excerpt: "Lịch tiêm vaccine đầy đủ và đúng thời điểm là chìa khóa bảo vệ sức khỏe thú cưng. Hãy cùng tìm hiểu lịch tiêm chi tiết...",
            category: "health",
            author: "Dr. Nguyễn Văn A",
            date: "2024-01-03",
            readTime: "6 phút đọc",
            image: "/placeholder.svg?height=300&width=400",
            featured: false,
            tags: ["vaccine", "tiêm phòng", "sức khỏe"],
        },
        {
            id: 7,
            title: "Thực phẩm độc hại mà chủ nuôi thường cho thú cưng ăn nhầm",
            excerpt: "Nhiều thực phẩm tốt cho con người lại có thể gây nguy hiểm cho thú cưng. Hãy cùng tìm hiểu danh sách những thực phẩm cần tránh...",
            category: "nutrition",
            author: "Dr. Trần Thị B",
            date: "2024-01-01",
            readTime: "5 phút đọc",
            image: "/placeholder.svg?height=300&width=400",
            featured: true,
            tags: ["dinh dưỡng", "độc hại", "an toàn"],
        },
        {
            id: 8,
            title: "Cách dạy chó ngồi, nằm, đứng cơ bản trong 1 tuần",
            excerpt: "Những lệnh cơ bản như ngồi, nằm, đứng là nền tảng cho việc huấn luyện thú cưng. Với phương pháp đúng, bạn có thể dạy chúng trong 1 tuần...",
            category: "training",
            author: "Chuyên gia Lê Văn C",
            date: "2023-12-28",
            readTime: "7 phút đọc",
            image: "/placeholder.svg?height=300&width=400",
            featured: false,
            tags: ["huấn luyện", "chó", "cơ bản"],
        },
    ]

    const filteredArticles = articles.filter((article) => {
        const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesCategory && matchesSearch
    })

    const featuredArticles = articles.filter(article => article.featured)
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
    const currentArticles = filteredArticles.slice(
        (currentPage - 1) * articlesPerPage,
        currentPage * articlesPerPage
    )

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getCategoryInfo = (categoryId) => {
        return categories.find(cat => cat.id === categoryId) || categories[0]
    }

    return (
        <>
            <style jsx>{`
        .news-page {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .news-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
            linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.03) 50%, transparent 60%);
          background-size: 400px 400px, 600px 600px, 100px 100px;
          animation: backgroundMove 20s ease-in-out infinite;
        }

        @keyframes backgroundMove {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(1deg); }
          66% { transform: translate(-20px, 20px) rotate(-1deg); }
        }

        .hero-section {
          padding: 120px 0 80px;
          position: relative;
          z-index: 2;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          color: white;
          text-align: center;
          margin-bottom: 1rem;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          text-align: center;
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .search-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 3rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .search-input {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 25px;
          padding: 15px 25px;
          font-size: 1.1rem;
          width: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .search-input:focus {
          outline: none;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .search-input::placeholder {
          color: #999;
        }

        .categories-section {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          margin-bottom: 4rem;
        }

        .category-btn {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 12px 24px;
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          font-weight: 500;
          cursor: pointer;
        }

        .category-btn:hover, .category-btn.active {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          color: white;
          text-decoration: none;
        }

        .category-btn.active {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .content-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 30px 30px 0 0;
          padding: 4rem 0;
          position: relative;
          z-index: 2;
          margin-top: 2rem;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
        }

        .featured-section {
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          text-align: center;
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 3rem;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .featured-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .featured-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .featured-image {
          height: 250px;
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
        }

        .featured-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .category-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .article-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .article-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
        }

        .article-image {
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .article-content {
          padding: 1.5rem;
        }

        .article-meta {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #666;
        }

        .article-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .article-excerpt {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .article-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }

        .article-author {
          font-weight: 500;
          color: #667eea;
        }

        .read-more-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .read-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
          color: white;
          text-decoration: none;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 1rem;
        }

        .tag {
          background: #f8f9fa;
          color: #666;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .pagination-section {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 3rem;
        }

        .pagination-btn {
          background: white;
          border: 1px solid #ddd;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .pagination-btn:hover, .pagination-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .no-results-icon {
          font-size: 4rem;
          color: #ddd;
          margin-bottom: 1rem;
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease;
        }

        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .search-section {
            padding: 1.5rem;
          }

          .categories-section {
            gap: 10px;
          }

          .category-btn {
            padding: 10px 16px;
            font-size: 0.9rem;
          }

          .content-section {
            padding: 2rem 0;
          }

          .section-title {
            font-size: 2rem;
          }

          .featured-grid, .articles-grid {
            grid-template-columns: 1fr;
          }

          .article-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>


            <div className="news-page">
                <Header></Header>
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="container">
                        <h1 className="hero-title">Tin Tức & Kiến Thức</h1>
                        <p className="hero-subtitle">
                            Cập nhật những thông tin mới nhất về chăm sóc thú cưng từ các chuyên gia hàng đầu
                        </p>

                        {/* Search Section */}
                        <div className="search-section">
                            <div className="row">
                                <div className="col-lg-8 mx-auto">
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Tìm kiếm bài viết, chủ đề..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <i className="bi bi-search position-absolute" style={{
                                            right: '20px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#999',
                                            fontSize: '1.2rem'
                                        }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="categories-section">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedCategory(category.id)
                                        setCurrentPage(1)
                                    }}
                                >
                                    <i className={`bi ${category.icon}`}></i>
                                    <span>{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="content-section">
                    <div className="container">
                        {/* Featured Articles */}
                        {selectedCategory === 'all' && (
                            <div className="featured-section">
                                <h2 className="section-title">Bài viết nổi bật</h2>
                                <p className="section-subtitle">Những bài viết được quan tâm nhất tuần này</p>

                                <div className="featured-grid">
                                    {featuredArticles.slice(0, 3).map((article, index) => {
                                        const categoryInfo = getCategoryInfo(article.category)
                                        return (
                                            <div
                                                key={article.id}
                                                className={`featured-card animate-on-scroll ${isVisible[`featured-${index}`] ? 'visible' : ''}`}
                                                id={`featured-${index}`}
                                            >
                                                <div
                                                    className="featured-image"
                                                    style={{ backgroundImage: `url(${article.image})` }}
                                                >
                                                    <div className="featured-badge">
                                                        <i className="bi bi-star-fill me-1"></i>
                                                        Nổi bật
                                                    </div>
                                                    <div className="category-badge" style={{ color: categoryInfo.color }}>
                                                        <i className={`bi ${categoryInfo.icon}`}></i>
                                                        {categoryInfo.name}
                                                    </div>
                                                </div>
                                                <div className="article-content">
                                                    <div className="article-meta">
                                                        <span><i className="bi bi-person me-1"></i>{article.author}</span>
                                                        <span><i className="bi bi-calendar me-1"></i>{formatDate(article.date)}</span>
                                                        <span><i className="bi bi-clock me-1"></i>{article.readTime}</span>
                                                    </div>
                                                    <h3 className="article-title">{article.title}</h3>
                                                    <p className="article-excerpt">{article.excerpt}</p>
                                                    <div className="tags-container">
                                                        {article.tags.map((tag, tagIndex) => (
                                                            <span key={tagIndex} className="tag">#{tag}</span>
                                                        ))}
                                                    </div>
                                                    <div className="article-footer">
                                                        <span className="article-author">{article.author}</span>
                                                        <a href={`/news/${article.id}`} className="read-more-btn">
                                                            Đọc tiếp <i className="bi bi-arrow-right ms-1"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* All Articles */}
                        <div className="articles-section">
                            <h2 className="section-title">
                                {selectedCategory === 'all' ? 'Tất cả bài viết' : `Bài viết về ${getCategoryInfo(selectedCategory).name}`}
                            </h2>
                            <p className="section-subtitle">
                                {filteredArticles.length} bài viết được tìm thấy
                            </p>

                            {currentArticles.length > 0 ? (
                                <>
                                    <div className="articles-grid">
                                        {currentArticles.map((article, index) => {
                                            const categoryInfo = getCategoryInfo(article.category)
                                            return (
                                                <div
                                                    key={article.id}
                                                    className={`article-card animate-on-scroll ${isVisible[`article-${index}`] ? 'visible' : ''}`}
                                                    id={`article-${index}`}
                                                >
                                                    <div
                                                        className="article-image"
                                                        style={{ backgroundImage: `url(${article.image})` }}
                                                    >
                                                        <div className="category-badge" style={{ color: categoryInfo.color }}>
                                                            <i className={`bi ${categoryInfo.icon}`}></i>
                                                            {categoryInfo.name}
                                                        </div>
                                                    </div>
                                                    <div className="article-content">
                                                        <div className="article-meta">
                                                            <span><i className="bi bi-person me-1"></i>{article.author}</span>
                                                            <span><i className="bi bi-calendar me-1"></i>{formatDate(article.date)}</span>
                                                            <span><i className="bi bi-clock me-1"></i>{article.readTime}</span>
                                                        </div>
                                                        <h3 className="article-title">{article.title}</h3>
                                                        <p className="article-excerpt">{article.excerpt}</p>
                                                        <div className="tags-container">
                                                            {article.tags.map((tag, tagIndex) => (
                                                                <span key={tagIndex} className="tag">#{tag}</span>
                                                            ))}
                                                        </div>
                                                        <div className="article-footer">
                                                            <span className="article-author">{article.author}</span>
                                                            <a href={`/news/${article.id}`} className="read-more-btn">
                                                                Đọc tiếp <i className="bi bi-arrow-right ms-1"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="pagination-section">
                                            <button
                                                className="pagination-btn"
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <i className="bi bi-chevron-left"></i>
                                            </button>

                                            {[...Array(totalPages)].map((_, index) => (
                                                <button
                                                    key={index + 1}
                                                    className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(index + 1)}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}

                                            <button
                                                className="pagination-btn"
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                            >
                                                <i className="bi bi-chevron-right"></i>
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="no-results">
                                    <div className="no-results-icon">
                                        <i className="bi bi-search"></i>
                                    </div>
                                    <h3>Không tìm thấy bài viết nào</h3>
                                    <p>Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                <Footer></Footer>
            </div>
        </>
    )
}

export default NewsPage
